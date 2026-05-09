"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { finishFocusSession, startFocusSession } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { focusSchema } from "@/lib/validators";

export async function startFocusSessionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = focusSchema.safeParse({
    label: formData.get("label"),
    durationMinutes: formData.get("durationMinutes"),
    habitId: formData.get("habitId") || undefined,
  });

  if (!parsed.success) {
    redirect("/focus?error=Please%20check%20the%20focus%20session%20form.");
  }

  try {
    startFocusSession(user, parsed.data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start that focus session.";
    redirect(`/focus?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/dashboard");
  revalidatePath("/focus");
  revalidatePath("/history");
}

export async function completeFocusSessionAction(formData: FormData) {
  const user = await requireUser();
  try {
    finishFocusSession(user, String(formData.get("sessionId")));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete that focus session.";
    redirect(`/focus?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/dashboard");
  revalidatePath("/focus");
  revalidatePath("/history");
}
