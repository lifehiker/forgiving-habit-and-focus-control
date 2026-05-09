const baseUrlInput = document.getElementById("baseUrl");
const tokenInput = document.getElementById("token");
const status = document.getElementById("status");

async function load() {
  const stored = await chrome.storage.sync.get(["baseUrl", "token"]);
  baseUrlInput.value = stored.baseUrl || "http://localhost:3000";
  tokenInput.value = stored.token || "";
}

document.getElementById("save").addEventListener("click", async () => {
  await chrome.storage.sync.set({
    baseUrl: baseUrlInput.value.trim(),
    token: tokenInput.value.trim(),
  });
  status.textContent = "Saved. The extension will poll the app for active session state.";
});

load();
