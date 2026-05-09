# Forging Habit Chrome Extension

This is a local Manifest V3 scaffold for the PRD's commitment-mode blocker.

## How it works

1. Load the `extension/` directory as an unpacked extension in Chrome.
2. Open the popup and set:
   - `App URL`: usually `http://localhost:3000`
   - `Extension token`: generated on `/settings/blocklist`
3. Start a focus session in the web app.
4. The service worker polls `/api/extension/state` and redirects blocked tabs to `blocked.html`.

## Safe fallback behavior

- If the app is unreachable, the extension keeps the last known payload.
- If no token is configured, the extension does nothing.
- Emergency override is shown only when the session payload allows it.
