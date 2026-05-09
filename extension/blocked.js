const params = new URLSearchParams(window.location.search);
const domain = params.get("domain");
const label = params.get("label");
const endsAt = params.get("endsAt");
const allowOverride = params.get("allowOverride") === "true";
const strictMode = params.get("strictMode") === "true";
const originalUrl = params.get("originalUrl");

document.getElementById("title").textContent = `You committed to focus instead of ${domain}.`;
document.getElementById("detail").textContent = `Session: ${label}. Block active until ${new Date(endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;

const overrideButton = document.getElementById("override");

if (allowOverride && !strictMode) {
  overrideButton.classList.remove("hidden");
  overrideButton.disabled = true;

  let remainingSeconds = 15;
  overrideButton.textContent = `Emergency override in ${remainingSeconds}s`;

  const interval = window.setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      window.clearInterval(interval);
      overrideButton.disabled = false;
      overrideButton.textContent = "Emergency override";
      return;
    }
    overrideButton.textContent = `Emergency override in ${remainingSeconds}s`;
  }, 1000);

  overrideButton.addEventListener("click", () => {
    if (!overrideButton.disabled) {
      chrome.runtime.sendMessage({ type: "allowOverride", domain }, (response) => {
        if (response?.ok && originalUrl) {
          window.location.replace(originalUrl);
          return;
        }

        overrideButton.textContent = "Override unavailable";
      });
    }
  });
}
