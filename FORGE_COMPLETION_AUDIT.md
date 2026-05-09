# FORGE Completion Audit

Last updated: 2026-05-09 (post-QA hardening)

## Foundation And Storage

- Local file-backed data store: [src/lib/store.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/store.ts)
- Core domain models: [src/lib/types.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/types.ts)
- Timezone/reset-aware habit-day logic: [src/lib/dates.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/dates.ts), [src/lib/habits/momentum.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/habits/momentum.ts)
- Base URL and metadata environment handling: [src/lib/env.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/env.ts), [src/app/layout.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/layout.tsx), [src/lib/seo.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/seo.ts), [src/app/robots.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/robots.ts), [src/app/sitemap.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/sitemap.ts)

## Auth And Onboarding

- Email-code auth flow and logout: [src/lib/actions/auth.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/auth.ts)
- Session lookup and route protection: [src/lib/session.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/session.ts), [src/app/(app)/layout.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/layout.tsx)
- Login page with Google credential fallback UI: [src/app/login/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/login/page.tsx), [src/components/login-request-form.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/login-request-form.tsx)
- Onboarding UI and persistence: [src/app/onboarding/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/onboarding/page.tsx), [src/lib/actions/settings.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/settings.ts), [src/lib/habit-templates.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/habit-templates.ts)

## Recovery-First Habits

- Habit CRUD, completion, restart logging, limits, and activity updates: [src/lib/app.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/app.ts), [src/lib/actions/habits.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/habits.ts), [src/lib/validators.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/validators.ts)
- Momentum summary and lapse detection: [src/lib/habits/momentum.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/habits/momentum.ts)
- Dashboard and habits pages: [src/app/(app)/dashboard/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/dashboard/page.tsx), [src/app/(app)/habits/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/habits/page.tsx)
- Dashboard UI components: [src/components/dashboard/dashboard-header.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/dashboard/dashboard-header.tsx), [src/components/dashboard/momentum-card.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/dashboard/momentum-card.tsx), [src/components/dashboard/today-habit-list.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/dashboard/today-habit-list.tsx), [src/components/dashboard/restart-prompt-card.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/dashboard/restart-prompt-card.tsx)
- Graceful error handling for restart and habit-limit edge cases: [src/lib/actions/habits.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/habits.ts), [src/app/(app)/dashboard/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/dashboard/page.tsx), [src/app/(app)/habits/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/habits/page.tsx)

## Focus Sessions And Blocking

- Focus session lifecycle, linked habits, and plan gating: [src/lib/app.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/app.ts), [src/lib/actions/focus.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/focus.ts)
- Focus page and countdown component: [src/app/(app)/focus/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/focus/page.tsx), [src/components/focus/focus-countdown.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/focus/focus-countdown.tsx)
- Graceful focus gating and countdown refresh polish: [src/lib/actions/focus.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/focus.ts), [src/app/(app)/focus/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/focus/page.tsx), [src/components/focus/focus-countdown.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/focus/focus-countdown.tsx)
- Blocklist management and extension token UI: [src/app/(app)/settings/blocklist/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/settings/blocklist/page.tsx), [src/lib/actions/extension.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/extension.ts)
- Extension APIs: [src/app/api/extension/health/route.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/api/extension/health/route.ts), [src/app/api/extension/state/route.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/api/extension/state/route.ts)
- Manifest V3 scaffold with polling, blocked interstitial, and override delay: [extension/manifest.json](/opt/forge-builds/forgiving-habit-and-focus-control/extension/manifest.json), [extension/service-worker.js](/opt/forge-builds/forgiving-habit-and-focus-control/extension/service-worker.js), [extension/popup.html](/opt/forge-builds/forgiving-habit-and-focus-control/extension/popup.html), [extension/popup.js](/opt/forge-builds/forgiving-habit-and-focus-control/extension/popup.js), [extension/blocked.html](/opt/forge-builds/forgiving-habit-and-focus-control/extension/blocked.html), [extension/blocked.js](/opt/forge-builds/forgiving-habit-and-focus-control/extension/blocked.js), [extension/README.md](/opt/forge-builds/forgiving-habit-and-focus-control/extension/README.md)

## History, Billing, Settings, Email, And Analytics

- History page and event aggregation: [src/app/(app)/history/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/history/page.tsx), [src/lib/app.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/app.ts)
- Billing page and local subscription fallback: [src/app/(app)/billing/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/billing/page.tsx), [src/lib/actions/billing.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/billing.ts), [src/lib/billing.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/billing.ts)
- Settings page and lifecycle email log surface: [src/app/(app)/settings/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/settings/page.tsx)
- Graceful onboarding/settings/blocklist validation fallback UI: [src/lib/actions/settings.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/settings.ts), [src/lib/actions/extension.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/actions/extension.ts), [src/app/onboarding/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/onboarding/page.tsx), [src/app/(app)/settings/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/settings/page.tsx), [src/app/(app)/settings/blocklist/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(app)/settings/blocklist/page.tsx)
- Email logging fallback: [src/lib/email.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/email.ts)
- Restart nudge scheduler and lifecycle triggers: [src/app/api/jobs/restart-nudges/route.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/api/jobs/restart-nudges/route.ts), [src/lib/app.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/app.ts)
- Analytics event capture: [src/lib/analytics.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/analytics.ts)

## Marketing, SEO, And Content

- Homepage and marketing shell: [src/app/(marketing)/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/page.tsx), [src/components/marketing-shell.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/components/marketing-shell.tsx)
- Pricing: [src/app/(marketing)/pricing/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/pricing/page.tsx)
- SEO landers: [src/app/(marketing)/forgiving-habit-tracker/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/forgiving-habit-tracker/page.tsx), [src/app/(marketing)/habit-tracker-no-streak/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/habit-tracker-no-streak/page.tsx), [src/app/(marketing)/focus-session-app/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/focus-session-app/page.tsx), [src/app/(marketing)/website-blocker-for-deep-work/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/website-blocker-for-deep-work/page.tsx), [src/app/(marketing)/habit-tracker-adhd/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/habit-tracker-adhd/page.tsx), [src/app/(marketing)/_components/seo-landing-page-view.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/_components/seo-landing-page-view.tsx)
- Blog index, detail route, and content library: [src/app/(marketing)/blog/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/blog/page.tsx), [src/app/(marketing)/blog/[slug]/page.tsx](/opt/forge-builds/forgiving-habit-and-focus-control/src/app/(marketing)/blog/[slug]/page.tsx), [src/lib/content.ts](/opt/forge-builds/forgiving-habit-and-focus-control/src/lib/content.ts)

## Deployment And Demo Support

- Standalone output config: [next.config.ts](/opt/forge-builds/forgiving-habit-and-focus-control/next.config.ts)
- Production Docker config: [Dockerfile](/opt/forge-builds/forgiving-habit-and-focus-control/Dockerfile), [.dockerignore](/opt/forge-builds/forgiving-habit-and-focus-control/.dockerignore)
- Environment template: [.env.example](/opt/forge-builds/forgiving-habit-and-focus-control/.env.example)
- Demo seed tooling: [scripts/seed-demo.mjs](/opt/forge-builds/forgiving-habit-and-focus-control/scripts/seed-demo.mjs), [package.json](/opt/forge-builds/forgiving-habit-and-focus-control/package.json)

## Intentionally Deferred External-Credential Items

- Google OAuth remains credential-gated. The email-code login path keeps the app fully functional without it.
- Stripe Checkout and customer-portal flows remain credential-gated. The billing page uses local plan switching so subscription gating still works without Stripe.
- Resend-backed email delivery remains credential-gated. Preview email logging keeps login codes and lifecycle messaging functional without outbound email.
- `docker build .` could not be completed here because Docker daemon access is blocked for the current user, even though Docker is installed.
