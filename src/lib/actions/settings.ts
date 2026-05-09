"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { completeOnboarding, updateProfile } from "@/lib/app";
import { starterHabitTemplates } from "@/lib/habit-templates";
import { requireUser } from "@/lib/session";
import { onboardingSchema } from "@/lib/validators";

export async function completeOnboardingAction(formData: FormData) {
  const user = await requireUser();
  const selectedNames = formData.getAll("starterHabits").map(String);
  const parsed = onboardingSchema.safeParse({
    rebuildGoal: formData.get("rebuildGoal"),
    timezone: formData.get("timezone"),
    resetHour: formData.get("resetHour"),
    starterHabits: selectedNames,
    customHabitName: formData.get("customHabitName"),
  });

  if (!parsed.success) {
    redirect("/onboarding?error=Please%20complete%20the%20onboarding%20form.");
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
    redirect(`/onboarding?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  try {
    updateProfile(user.id, {
      name: String(formData.get("name") || user.name),
      timezone: String(formData.get("timezone") || user.timezone),
      resetHour: Number(formData.get("resetHour") || user.resetHour),
      allowEmergencyOverride: formData.get("allowEmergencyOverride") === "on",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save those settings right now.";
    redirect(`/settings?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
