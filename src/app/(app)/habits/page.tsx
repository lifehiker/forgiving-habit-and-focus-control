import { getTodayHabitStatus } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Habits",
  path: "/habits",
});

export default async function HabitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const habits = getTodayHabitStatus(user.id);
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="glass rounded-[1.9rem] p-6">
        {error ? (
          <div className="mb-5 rounded-[1.2rem] border border-[var(--danger)]/20 bg-[var(--accent-soft)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">Active habits</p>
        <h1 className="mt-2 text-3xl font-semibold">Edit your routine without overcomplicating it.</h1>
        <div className="mt-5 space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="rounded-[1.3rem] border border-[var(--line)] bg-white/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{habit.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {habit.category} · {habit.cadenceType === "daily" ? "Daily" : `${habit.targetPerWeek ?? 3}x / week`}
                  </p>
                </div>
                <form action="/api/forms/habits" method="post">
                  <input name="intent" type="hidden" value="archive" />
                  <input name="returnTo" type="hidden" value="/habits" />
                  <input name="habitId" type="hidden" value={habit.id} />
                  <button className="button-ghost px-4 py-2 text-sm" type="submit">
                    Archive
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <form action="/api/forms/habits" className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow)]" method="post">
        <input name="intent" type="hidden" value="create" />
        <input name="returnTo" type="hidden" value="/habits" />
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">New habit</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input className="field" id="name" name="name" placeholder="Shutdown ritual" required type="text" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="cadenceType">
                Cadence
              </label>
              <select className="select" defaultValue="daily" id="cadenceType" name="cadenceType">
                <option value="daily">Daily</option>
                <option value="weekly">Times per week</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="targetPerWeek">
                Weekly target
              </label>
              <input className="field" defaultValue={3} id="targetPerWeek" max={7} min={1} name="targetPerWeek" type="number" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="category">
              Category
            </label>
            <input className="field" id="category" name="category" placeholder="Focus" required type="text" />
          </div>
          <button className="button-primary w-full" type="submit">
            Add habit
          </button>
          <p className="text-sm text-[var(--muted-foreground)]">
            Free plan users can keep up to 3 active habits. Upgrade from Billing for unlimited habits.
          </p>
        </div>
      </form>
    </div>
  );
}
