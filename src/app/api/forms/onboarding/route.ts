import { revalidatePath } from "next/cache";

import { completeOnboarding } from "@/lib/app";
import { buildRedirect } from "@/lib/form-routes";
import { starterHabitTemplates } from "@/lib/habit-templates";
import { requireUser } from "@/lib/session";
import { onboardingSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const selectedNames = formData.getAll("starterHabits").map(String);
  const parsed = onboardingSchema.safeParse({
    rebuildGoal: formData.get("rebuildGoal"),
    timezone: formData.get("timezone"),
    resetHour: formData.get("resetHour"),
    starterHabits: selectedNames,
    customHabitName: formData.get("customHabitName"),
  });

  if (!parsed.success) {
    return buildRedirect(request, "/onboarding?error=Please%20complete%20the%20onboarding%20form.");
  }

  const chosen = starterHabitTemplates.filter((habit) =>
    parsed.data.starterHabits.includes(habit.name),
  );
  const customHabit = parsed.data.customHabitName
    ? [
        {
          name: parsed.data.customHabitName,
          cadenceType: "daily" as const,
          targetPerWeek: null,
          category: "Custom",
        },
      ]
    : [];

  try {
    completeOnboarding(user.id, {
      rebuildGoal: parsed.data.rebuildGoal,
      timezone: parsed.data.timezone,
      resetHour: parsed.data.resetHour,
      starterHabits: [...chosen, ...customHabit],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to finish onboarding right now.";
    return buildRedirect(request, `/onboarding?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/dashboard");
  return buildRedirect(request, "/dashboard");
}
