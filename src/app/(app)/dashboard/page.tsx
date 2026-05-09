import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MomentumCard } from "@/components/dashboard/momentum-card";
import { RestartPromptCard } from "@/components/dashboard/restart-prompt-card";
import { TodayHabitList } from "@/components/dashboard/today-habit-list";
import { getAppSnapshot, getHistoryEvents, getTodayHabitStatus } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard",
  path: "/dashboard",
});

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const snapshot = getAppSnapshot(user);
  const habits = getTodayHabitStatus(user.id);
  const history = getHistoryEvents(user.id).slice(0, 4);
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[1.3rem] border border-[var(--danger)]/20 bg-[var(--accent-soft)] p-4 text-sm text-[var(--danger)]">
          {error}
        </div>
      ) : null}
      <DashboardHeader
        activeSessionLabel={
          snapshot.activeSession
            ? `${snapshot.activeSession.label} until ${new Date(snapshot.activeSession.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
            : undefined
        }
        user={user}
      />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.8fr]">
        <TodayHabitList habits={habits} />
        <div className="space-y-6">
          <MomentumCard {...snapshot.momentum} />
          <RestartPromptCard habits={snapshot.habits} lapses={snapshot.openLapses} />
        </div>
      </div>
      <section className="glass rounded-[1.75rem] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow text-xs text-[var(--muted-foreground)]">Recent activity</p>
            <h2 className="mt-2 text-2xl font-semibold">Momentum log</h2>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {history.length ? (
            history.map((event) => (
              <div key={event.id} className="rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{event.detail}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-[var(--line)] bg-white/50 p-4 text-sm text-[var(--muted-foreground)]">
              Your momentum log will fill in as you complete habits, log restarts, and finish focus sessions.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
