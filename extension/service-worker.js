const POLL_ALARM = "poll-session-state";
const DEFAULT_BASE_URL = "http://localhost:3000";

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
  } catch {
    // Safe fallback: keep previous payload if the app is unreachable.
  }
}

async function handleTab(tabId, url) {
  const { payload } = await getConfig();
  if (!payload?.session || !url) return;

  if (isBlockedUrl(url, payload.blockedDomains || [])) {
    const redirectUrl = chrome.runtime.getURL(
      `blocked.html?domain=${encodeURIComponent(new URL(url).hostname)}&label=${encodeURIComponent(payload.session.label)}&endsAt=${encodeURIComponent(payload.session.endsAt)}&allowOverride=${encodeURIComponent(String(payload.session.allowOverride))}&strictMode=${encodeURIComponent(String(payload.session.strictMode))}`,
    );
    await chrome.tabs.update(tabId, { url: redirectUrl });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
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
