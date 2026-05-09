import type { Habit, HabitLapse } from "@/lib/types";

const reasons = [
  { value: "busy", label: "Busy" },
  { value: "forgot", label: "Forgot" },
  { value: "low-energy", label: "Low energy" },
  { value: "disrupted-schedule", label: "Disrupted schedule" },
  { value: "other", label: "Other" },
] as const;

export function RestartPromptCard({
  lapses,
  habits,
}: {
  lapses: HabitLapse[];
  habits: Habit[];
}) {
  return (
    <section className="glass rounded-[1.75rem] p-6">
      <p className="eyebrow text-xs text-[var(--muted-foreground)]">Recovery prompts</p>
      <h2 className="mt-2 text-2xl font-semibold">Restart today</h2>
      <div className="mt-5 space-y-3">
        {lapses.length ? (
          lapses.map((lapse) => {
            const habit = habits.find((entry) => entry.id === lapse.habitId);
            return (
              <form
                key={lapse.id}
                action="/api/forms/habits"
                className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--accent-soft)] p-4"
                method="post"
              >
                <input type="hidden" name="intent" value="restart" />
                <input type="hidden" name="returnTo" value="/dashboard" />
                <input type="hidden" name="habitId" value={lapse.habitId} />
                <p className="font-semibold">{habit?.name ?? "Habit"}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  You missed {lapse.lapseDate}. Name the interruption, then restart cleanly.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <label
                      key={reason.value}
                      className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="restartReason"
                        value={reason.value}
                        className="mr-2"
                        required
                      />
                      {reason.label}
                    </label>
                  ))}
                </div>
                <button className="button-primary mt-4 px-4 py-2 text-sm" type="submit">
                  Restart
                </button>
              </form>
            );
          })
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted-foreground)]">
            No open lapses right now. When a day slips, the recovery prompt will show here.
          </div>
        )}
      </div>
    </section>
  );
}
