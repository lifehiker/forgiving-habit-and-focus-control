import { redirect } from "next/navigation";

import { completeOnboardingAction } from "@/lib/actions/settings";
import { starterHabitTemplates } from "@/lib/habit-templates";
import { requireUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Onboarding",
  path: "/onboarding",
});

const preferredTimezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const timezoneOptions = Array.from(
  new Set([
    ...preferredTimezones,
    ...Intl.supportedValuesOf("timeZone"),
  ]),
);

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  if (user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="shell grid gap-8 py-8 md:grid-cols-[1fr_1fr]">
      <section className="space-y-4">
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">Onboarding</p>
        <h1 className="text-4xl font-semibold tracking-tight">What are you trying to rebuild?</h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">
          Pick a few starter habits, choose your timezone and daily reset time, and keep the setup light enough that you actually start.
        </p>
      </section>
      <form action={completeOnboardingAction} className="glass space-y-5 rounded-[2rem] p-6">
        {error ? (
          <div className="rounded-[1.2rem] border border-[var(--danger)]/20 bg-[var(--accent-soft)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="rebuildGoal">
            Rebuild goal
          </label>
          <input className="field" defaultValue={user.rebuildGoal} id="rebuildGoal" name="rebuildGoal" placeholder="a calmer work rhythm" required type="text" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="timezone">
              Timezone
            </label>
            <select className="select" defaultValue={user.timezone} id="timezone" name="timezone">
              {timezoneOptions.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="resetHour">
              Daily reset hour
            </label>
            <select className="select" defaultValue={String(user.resetHour)} id="resetHour" name="resetHour">
              {Array.from({ length: 24 }, (_, hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>
        </div>
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Starter habits</legend>
          <div className="grid gap-3">
            {starterHabitTemplates.map((habit, index) => (
              <label key={habit.name} className="rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4 text-sm">
                <input
                  className="mr-3"
                  defaultChecked={index < 3}
                  name="starterHabits"
                  type="checkbox"
                  value={habit.name}
                />
                <span className="font-semibold">{habit.name}</span>
                <span className="ml-2 text-[var(--muted-foreground)]">
                  {habit.cadenceType === "daily" ? "Daily" : `${habit.targetPerWeek}x / week`} · {habit.category}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="customHabitName">
            Optional custom habit
          </label>
          <input className="field" id="customHabitName" name="customHabitName" placeholder="10 minute planning sweep" type="text" />
        </div>
        <button className="button-primary w-full" type="submit">
          Finish onboarding
        </button>
      </form>
    </div>
  );
}
