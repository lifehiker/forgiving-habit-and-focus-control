"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { archiveHabit, completeHabit, createHabit, restartHabit } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { habitSchema, restartSchema } from "@/lib/validators";

export async function createHabitAction(formData: FormData) {
  const user = await requireUser();
  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    cadenceType: formData.get("cadenceType"),
    targetPerWeek: formData.get("targetPerWeek"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    redirect("/habits?error=Please%20check%20the%20habit%20form%20and%20try%20again.");
  }

  try {
    createHabit(user, parsed.data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create that habit right now.";
    redirect(`/habits?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/dashboard");
  revalidatePath("/habits");
}

export async function archiveHabitAction(formData: FormData) {
  const user = await requireUser();
  archiveHabit(user.id, String(formData.get("habitId")));
  revalidatePath("/dashboard");
  revalidatePath("/habits");
}

export async function completeHabitForToday(formData: FormData) {
  const user = await requireUser();
  completeHabit(user, String(formData.get("habitId")), "manual");
  revalidatePath("/dashboard");
  revalidatePath("/habits");
  revalidatePath("/history");
}

export async function restartHabitAction(formData: FormData) {
  const user = await requireUser();
  const parsed = restartSchema.safeParse({
    habitId: formData.get("habitId"),
    restartReason: formData.get("restartReason"),
  });

  if (!parsed.success) {
    redirect("/dashboard?error=Select%20a%20restart%20reason.");
  }

  try {
    restartHabit(user.id, parsed.data.habitId, parsed.data.restartReason);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to log that restart right now.";
    redirect(`/dashboard?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/dashboard");
  revalidatePath("/history");
}
