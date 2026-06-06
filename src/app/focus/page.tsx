import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { FocusCountdown } from "@/components/focus/focus-countdown";
import { getActiveFocusSession, getTodayHabitStatus } from "@/lib/app";
import { getCurrentUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Focus",
  path: "/focus",
});

const presets = [15, 25, 45, 60];

export default async function FocusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="shell py-16">
        <h1 className="text-3xl font-semibold">Focus Sessions</h1>
        <p className="mt-6 text-[var(--muted-foreground)]">
          Sign in to start focus sessions and track your deep work blocks.
        </p>
        <Link className="button-primary mt-6 inline-flex" href="/login">
          Sign in
        </Link>
      </div>
    );
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  const params = await searchParams;
  const activeSession = getActiveFocusSession(user.id);
  const habits = getTodayHabitStatus(user.id);
  const error = typeof params.error === "string" ? params.error : null;
  const linkedHabitLocked = user.subscription.plan === "free";

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {error ? (
          <div className="rounded-[1.3rem] border border-[var(--danger)]/20 bg-[var(--accent-soft)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,#17382f_0%,#265d49_50%,#245945_100%)] p-7 text-white shadow-[var(--shadow)]">
          <div className="hero-noise absolute inset-0" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-4">
              <p className="eyebrow text-xs text-white/70">Focus sessions</p>
              <h1 className="text-4xl font-semibold tracking-tight">Protect a block before distraction negotiates with you.</h1>
              <p className="max-w-2xl text-base leading-8 text-white/78">
                Use a simple label, choose a duration, and optionally link the session to a habit if you are on Pro.
              </p>
            </div>
            {activeSession ? <FocusCountdown endsAt={activeSession.endsAt} label={activeSession.label} /> : null}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form action="/api/forms/focus" className="glass rounded-[1.85rem] p-6" method="post">
            <input name="intent" type="hidden" value="start" />
            <p className="eyebrow text-xs text-[var(--muted-foreground)]">Start a block</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="label">
                  Session label
                </label>
                <input
                  className="field"
                  disabled={Boolean(activeSession)}
                  id="label"
                  name="label"
                  placeholder="Write project brief"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="durationMinutes">
                  Duration
                </label>
                <select
                  className="select"
                  defaultValue="25"
                  disabled={Boolean(activeSession)}
                  id="durationMinutes"
                  name="durationMinutes"
                >
                  {presets.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset} minutes
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="habitId">
                  Linked habit
                </label>
                <select
                  className="select"
                  defaultValue=""
                  disabled={Boolean(activeSession) || linkedHabitLocked}
                  id="habitId"
                  name="habitId"
                >
                  <option value="">None</option>
                  {habits.map((habit) => (
                    <option key={habit.id} value={habit.id}>
                      {habit.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="button-primary w-full" disabled={Boolean(activeSession)} type="submit">
                Start focus session
              </button>
              {activeSession ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  One focus session can run at a time. Finish the current block before starting the next one.
                </p>
              ) : linkedHabitLocked ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Linked focus sessions are part of Pro. Upgrade on the Billing page to count focus blocks toward a habit.
                </p>
              ) : null}
            </div>
          </form>

          <section className="rounded-[1.85rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow)]">
            <p className="eyebrow text-xs text-[var(--muted-foreground)]">Current state</p>
            {activeSession ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 p-5">
                  <p className="text-2xl font-semibold">{activeSession.label}</p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Ends at {new Date(activeSession.endsAt).toLocaleString()} · {activeSession.durationMinutes} minutes
                  </p>
                </div>
                <form action="/api/forms/focus" method="post">
                  <input name="intent" type="hidden" value="complete" />
                  <input name="sessionId" type="hidden" value={activeSession.id} />
                  <button className="button-primary" type="submit">
                    Mark session complete
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
                No active session right now. Free users can start up to 5 sessions per rolling week. Pro adds linked habits and stricter blocking behavior.
              </p>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
