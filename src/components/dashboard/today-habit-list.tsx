import { completeHabitForToday } from "@/lib/actions/habits";
import type { Habit } from "@/lib/types";

export function TodayHabitList({
  habits,
}: {
  habits: Array<Habit & { isComplete: boolean }>;
}) {
  return (
    <section className="glass rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Today&apos;s habits</p>
          <h2 className="mt-2 text-2xl font-semibold">Quick check-in</h2>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{habits.length} active habits</p>
      </div>
      <div className="mt-5 space-y-3">
        {habits.length ? (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--line)] bg-white/60 p-4"
            >
              <div>
                <p className="font-semibold">{habit.name}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {habit.category} ·{" "}
                  {habit.cadenceType === "daily"
                    ? "Daily"
                    : `${habit.targetPerWeek ?? 3} times per week`}
                </p>
              </div>
              {habit.isComplete ? (
                <span className="rounded-full bg-[var(--primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--primary-strong)]">
                  Completed
                </span>
              ) : (
                <form action={completeHabitForToday}>
                  <input type="hidden" name="habitId" value={habit.id} />
                  <button className="button-primary px-4 py-2 text-sm" type="submit">
                    Mark complete
                  </button>
                </form>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted-foreground)]">
            No habits yet. Use onboarding or the habits page to add your first routine.
          </div>
        )}
      </div>
    </section>
  );
}
