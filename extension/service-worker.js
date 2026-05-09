const POLL_ALARM = "poll-session-state";
const DEFAULT_BASE_URL = "http://localhost:3000";
const OVERRIDES_KEY = "overrides";

async function getConfig() {
  const stored = await chrome.storage.sync.get(["baseUrl", "token", "payload"]);
  return {
    baseUrl: stored.baseUrl || DEFAULT_BASE_URL,
    token: stored.token || "",
    payload: stored.payload || { session: null, blockedDomains: [] },
  };
}

async function savePayload(payload) {
  await chrome.storage.sync.set({ payload });
}

async function getOverrides() {
  const stored = await chrome.storage.local.get([OVERRIDES_KEY]);
  return stored[OVERRIDES_KEY] || {};
}

async function saveOverrides(overrides) {
  await chrome.storage.local.set({ [OVERRIDES_KEY]: overrides });
}

function buildOverrideKey(sessionId, domain) {
  return `${sessionId}:${domain}`;
}

async function clearExpiredOverrides(session) {
  const overrides = await getOverrides();
  const nextOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([key, expiresAt]) => {
      if (!expiresAt || new Date(expiresAt) <= new Date()) {
        return false;
      }

      if (!session) {
        return false;
      }

      return key.startsWith(`${session.id}:`);
    }),
  );

  await saveOverrides(nextOverrides);
  return nextOverrides;
}

function isBlockedUrl(url, blockedDomains) {
  try {
    const { hostname } = new URL(url);
    return blockedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

async function refreshPayload() {
  const { baseUrl, token } = await getConfig();
  if (!token) return;

  try {
    const response = await fetch(`${baseUrl}/api/extension/state`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return;
    const payload = await response.json();
    await savePayload(payload);
    await clearExpiredOverrides(payload.session);
  } catch {
    // Safe fallback: keep previous payload if the app is unreachable.
  }
}

async function handleTab(tabId, url) {
  const { payload } = await getConfig();
  if (!payload?.session || !url) return;
  if (url.startsWith(chrome.runtime.getURL("blocked.html"))) return;

  const hostname = new URL(url).hostname;
  const overrides = await clearExpiredOverrides(payload.session);
  const overrideKey = buildOverrideKey(payload.session.id, hostname);

  if (overrides[overrideKey] && new Date(overrides[overrideKey]) > new Date()) {
    return;
  }

  if (isBlockedUrl(url, payload.blockedDomains || [])) {
    const redirectUrl = chrome.runtime.getURL(
      `blocked.html?domain=${encodeURIComponent(hostname)}&label=${encodeURIComponent(payload.session.label)}&endsAt=${encodeURIComponent(payload.session.endsAt)}&allowOverride=${encodeURIComponent(String(payload.session.allowOverride))}&strictMode=${encodeURIComponent(String(payload.session.strictMode))}&originalUrl=${encodeURIComponent(url)}`,
    );
    await chrome.tabs.update(tabId, { url: redirectUrl });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create(POLL_ALARM, { periodInMinutes: 0.25 });
  await refreshPayload();
});

chrome.runtime.onStartup.addListener(async () => {
  chrome.alarms.create(POLL_ALARM, { periodInMinutes: 0.25 });
  await refreshPayload();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === POLL_ALARM) {
    await refreshPayload();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    await handleTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url) {
    await handleTab(tabId, tab.url);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "allowOverride") {
    return false;
  }

  (async () => {
    const { payload } = await getConfig();
    const session = payload?.session;
    const domain = message.domain;

    if (
      !session ||
      !domain ||
      !session.allowOverride ||
      session.strictMode ||
      new Date(session.endsAt) <= new Date()
    ) {
      sendResponse({ ok: false });
      return;
    }

    const overrides = await clearExpiredOverrides(session);
    overrides[buildOverrideKey(session.id, domain)] = session.endsAt;
    await saveOverrides(overrides);
    sendResponse({ ok: true, endsAt: session.endsAt });
  })();

  return true;
});
