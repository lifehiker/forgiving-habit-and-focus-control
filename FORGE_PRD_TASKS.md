# FORGE PRD Tasks

Last updated: 2026-05-11 (fresh build verification, dev/standalone smoke tests, and Dockerfile copy-path fix)

## Phase 1: Foundation

- [x] Read `PRD.md` end-to-end.
- [x] Read `BUILD_INSTRUCTIONS.md` end-to-end.
- [x] Read local Next.js App Router docs in `node_modules/next/dist/docs/`.
- [x] Audit the existing codebase to understand implemented vs missing work.
- [x] Confirm local data persistence strategy is reliable for build/dev without external services.
- [x] Confirm `next.config.ts` uses `output: "standalone"`.
- [x] Confirm no `next/font/google` usage and no build-time network dependencies.
- [x] Confirm third-party integrations are lazy/guarded and do not initialize at module scope.

## Phase 2: Data Model And Auth

- [x] Local fallback user/session/login-code data model exists.
- [x] Local fallback habit, completion, lapse, focus session, blocklist, subscription, extension token, analytics, and email log models exist.
- [x] Validate model coverage against PRD requirements and add any missing fields or derived helpers.
- [x] Email sign-in flow exists with local magic-code fallback.
- [x] Add a safe Google sign-in fallback path or clearly present Google as credential-gated while keeping the app functional.
- [x] Onboarding page exists.
- [x] Ensure onboarding completion flow redirects correctly and fully persists timezone/reset-time/rebuild-goal/starter habits/custom habit.
- [x] Ensure user activity timestamps update across primary workflows for restart-email logic.

## Phase 3: Core User-Facing Pages

- [x] Marketing homepage exists.
- [x] Login page exists.
- [x] Onboarding page exists.
- [x] Dashboard page exists.
- [x] Habits page exists.
- [x] Focus page exists.
- [x] History page exists.
- [x] Billing page exists.
- [x] Settings page exists.
- [x] Blocklist settings page exists.
- [x] Review every page for PRD completeness, polish, responsiveness, and empty/error states.

## Phase 4: Core Workflows

- [x] Habit creation exists.
- [x] Habit completion from dashboard exists.
- [x] Momentum summary exists.
- [x] Lapse detection exists.
- [x] Restart prompt UI exists.
- [x] Restart reason logging exists.
- [x] Verify lapse detection behavior for daily and weekly cadence edge cases.
- [x] Focus session creation exists.
- [x] Active focus countdown exists.
- [x] Focus completion exists.
- [x] Linked habit completion from focus session exists.
- [x] Free-vs-Pro habit/focus/blocklist gating exists.
- [x] Verify all gating behavior matches PRD language and graceful upgrade paths.
- [x] Improve workflow feedback where current forms/actions fail silently or ungracefully.
- [x] Replace deployment-sensitive server-action form posts with stable POST route handlers to eliminate action-ID skew failures.

## Phase 5: APIs, Server Actions, And Extension

- [x] Habit mutation endpoints exist.
- [x] Focus mutation endpoints exist.
- [x] Billing mutation endpoint exists.
- [x] Settings mutation endpoint exists.
- [x] Extension/blocklist mutation endpoint exists.
- [x] Extension health API exists.
- [x] Extension session-state API exists.
- [x] Restart-nudge job route exists.
- [x] Add the required local Chrome extension scaffold in `extension/` with Manifest V3 files.
- [x] Ensure extension flow supports token auth, active session sync, blocked-domain matching, interstitial blocking UX, and free/paid override behavior.

## Phase 6: Billing, Email, Storage Integrations Or Safe Fallbacks

- [x] Local file storage fallback exists.
- [x] Local email-log fallback exists.
- [x] Local billing-plan switching fallback exists.
- [x] Add Stripe-safe guarded code path or explicit billing credential fallback notes without breaking app runtime.
- [x] Add email credential fallback notes where needed without blocking app usage.
- [x] Verify restart nudge, welcome, login, and upgrade email flows are reachable and logged.

## Phase 7: Marketing, SEO, And Content

- [x] Homepage exists.
- [x] Pricing page exists.
- [x] SEO landing pages exist:
  - [x] `/forgiving-habit-tracker`
  - [x] `/habit-tracker-no-streak`
  - [x] `/focus-session-app`
  - [x] `/website-blocker-for-deep-work`
  - [x] `/habit-tracker-adhd`
- [x] Blog index exists.
- [x] Blog detail route exists.
- [x] Verify blog/content coverage matches PRD targets.
- [x] `robots` route exists.
- [x] `sitemap` route exists.
- [x] Review metadata, canonical/base URL handling, and production-readiness.

## Phase 8: Deployment

- [x] Standalone Next output configured.
- [x] Create production-ready `Dockerfile`.
- [x] Ensure Dockerfile only copies directories/files that actually exist.
- [x] Attempt `docker build .` if Docker is available.

## Phase 9: Verification

- [x] Run `npm run build` and fix all build errors.
- [x] Start the dev server and confirm it boots without crashing.
- [x] Start the standalone production server and confirm it boots without crashing.
- [x] Smoke-test primary routes.
- [x] Test core interactivity: auth, onboarding, habits, restart flow, focus sessions, billing switch, settings, blocklist, extension API.
- [x] Review pages/components visually and fix polish issues found during testing.
- [x] Re-read relevant PRD sections after each major phase and update this file with completed work and remaining gaps.
- [x] Create `HUMAN_INPUT_NEEDED.md` for any external credential/account requirements.
- [x] Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to implementation files/routes/actions.
- [x] Only declare `FORGE_BUILD_COMPLETE` once build, dev boot, smoke tests, docs, and audit are all complete.

## Remaining notes

- Final QA fixes completed after route verification:
  - Removed the invalid `public/` copy from `Dockerfile` because this repo does not ship a `public/` directory; the container build path now only copies directories that actually exist.
  - Replaced user-facing Server Action form submissions with route-handler POST endpoints after reproducing the deployment-time action lookup failures locally.
  - Removed the now-unused `src/lib/actions/*` Server Action modules so the shipped app only uses the stable POST mutation routes.
  - Added a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` and optional `deploymentId` wiring for self-hosted Next.js deployment safety.
  - Added a Next 16 `proxy.ts` guard that converts stale `Next-Action` POSTs into clean page reload redirects, preventing production logs from filling with missing Server Action lookup errors during post-deploy skew.
  - Corrected relative form redirects so standalone/proxied deployments do not leak `0.0.0.0` in `Location` headers.
  - Corrected local-vs-standalone file-store path resolution so production-style standalone runs and repo-root runs use the intended persistent data directory.
  - Tightened the file-store path to a statically scoped `/data/app-data.json` fallback so Turbopack standalone tracing no longer warns about tracing the whole project.
  - Fixed auth redirect persistence by attaching the session cookie to the actual verify/logout redirect responses instead of relying on ambient cookie mutation alone.
  - Enforced the free-plan 3-habit limit during onboarding so signup no longer bypasses subscription gating.
  - Hardened auth request-code and onboarding route handlers so missing optional text inputs no longer fail validation on non-browser or proxied submissions.
  - Re-verified live flows in standalone mode: request-code auth, logout, onboarding, dashboard completion, focus start/finish, linked-habit completion, billing switch, settings save, extension token generation, extension state fetch, blocklist add/remove, and stale-action request recovery.
  - Re-ran clean-room smoke tests against a fresh `APP_DATA_DIR` to verify auth, onboarding, free-plan gating, Pro upgrade, habit completion, linked focus completion, extension token/state sync, blocklist mutation, primary route responses, and stale `Next-Action` redirect behavior end-to-end.
  - Re-verified on 2026-05-11 that `npm run build`, `npm run lint`, `npm run dev`, and `npm run start` all succeed after the Dockerfile fix.
- `docker build .` was attempted and failed because Docker daemon access to `/var/run/docker.sock` is blocked for the current user in this environment.
