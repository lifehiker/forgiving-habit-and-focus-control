import Link from "next/link";

import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Forgiving Habit Tracker + Focus Session Blocker",
  path: "/",
  keywords: [
    "forgiving habit tracker",
    "habit tracker no streak",
    "focus session app",
    "website blocker for deep work",
  ],
});

const proofPoints = [
  "Restart prompts turn missed days into immediate recovery actions.",
  "Focus sessions protect real work with a synced Chrome blocklist.",
  "Momentum summaries give you signal without streak shame.",
];

export default function HomePage() {
  return (
    <div className="space-y-14 pb-10">
      <section className="shell">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,#18372f_0%,#1f6a52_42%,#f4a167_135%)] px-6 py-10 text-white shadow-[var(--shadow)] md:px-10 md:py-14">
          <div className="hero-noise absolute inset-0" />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_0.9fr] md:items-end">
            <div className="space-y-5">
              <p className="eyebrow text-xs text-white/70">Built for people who restart often</p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
                Rebuild habits without streak guilt. Protect focus when it matters.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/78">
                Forging Habit combines a recovery-first habit tracker with commitment-mode focus
                sessions and browser blocking. Miss the day, log the interruption, restart today.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link className="button-primary bg-white text-[var(--primary-strong)]" href="/login">
                  Start free
                </Link>
                <Link className="button-secondary border-white/15 bg-white/10 text-white" href="/pricing">
                  See pricing
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6">
              <p className="text-sm text-white/70">What the app does differently</p>
              <div className="mt-4 space-y-3">
                {proofPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm leading-7 text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Recovery-first dashboard",
            copy: "See today’s habits, current momentum, active focus status, and restart prompts in one calm screen.",
          },
          {
            title: "Focus blocks with teeth",
            copy: "Start 15, 25, 45, or 60 minute sessions and sync your blocklist to a local Chrome extension scaffold.",
          },
          {
            title: "Freemium that makes sense",
            copy: "Try up to 3 habits and 5 weekly focus blocks free, then upgrade for unlimited habits, history filters, and strict mode.",
          },
        ].map((card) => (
          <div key={card.title} className="glass rounded-[1.8rem] p-6">
            <p className="eyebrow text-xs text-[var(--muted-foreground)]">{card.title}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">{card.copy}</p>
          </div>
        ))}
      </section>

      <section className="shell grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="glass rounded-[2rem] p-7">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold">A habit system designed for return speed.</h2>
          <div className="prose-copy mt-5 space-y-4 text-sm">
            <p>Pick starter habits during onboarding or add your own custom routine.</p>
            <p>Each miss creates a gentle restart card instead of a shame-heavy failure state.</p>
            <p>When you need real work protection, start a focus block and let the blocker hold the boundary.</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-7 shadow-[var(--shadow)]">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Explore the wedge</p>
          <div className="mt-4 grid gap-3">
            {[
              ["/forgiving-habit-tracker", "Forgiving habit tracker"],
              ["/habit-tracker-no-streak", "Habit tracker without streaks"],
              ["/focus-session-app", "Focus session app"],
              ["/website-blocker-for-deep-work", "Website blocker for deep work"],
              ["/habit-tracker-adhd", "ADHD-friendly habits"],
            ].map(([href, label]) => (
              <Link
                key={href}
                className="rounded-[1.2rem] border border-[var(--line)] bg-white/75 px-4 py-3 text-sm font-semibold transition hover:bg-white"
                href={href}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
