import { revalidatePath } from "next/cache";

import { archiveHabit, completeHabit, createHabit, restartHabit } from "@/lib/app";
import { buildRedirect, getReturnTo } from "@/lib/form-routes";
import { requireUser } from "@/lib/session";
import { habitActionSchema, habitSchema, restartSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  const returnTo = getReturnTo(formData, intent === "create" || intent === "archive" ? "/habits" : "/dashboard");

  if (intent === "create") {
    const parsed = habitSchema.safeParse({
      name: formData.get("name"),
      cadenceType: formData.get("cadenceType"),
      targetPerWeek: formData.get("targetPerWeek"),
      category: formData.get("category"),
    });

    if (!parsed.success) {
      return buildRedirect(request, "/habits?error=Please%20check%20the%20habit%20form%20and%20try%20again.");
    }

    try {
      createHabit(user, parsed.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create that habit right now.";
      return buildRedirect(request, `/habits?error=${encodeURIComponent(message)}`);
    }
  } else if (intent === "archive") {
    const parsed = habitActionSchema.safeParse({
      habitId: formData.get("habitId"),
    });
    if (!parsed.success) {
      return buildRedirect(request, `/habits?error=${encodeURIComponent("That habit request was invalid.")}`);
    }
    archiveHabit(user.id, parsed.data.habitId);
  } else if (intent === "complete") {
    const parsed = habitActionSchema.safeParse({
      habitId: formData.get("habitId"),
    });
    if (!parsed.success) {
      return buildRedirect(request, `/dashboard?error=${encodeURIComponent("That habit request was invalid.")}`);
    }
    try {
      completeHabit(user, parsed.data.habitId, "manual");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to complete that habit right now.";
      return buildRedirect(request, `/dashboard?error=${encodeURIComponent(message)}`);
    }
  } else if (intent === "restart") {
    const parsed = restartSchema.safeParse({
      habitId: formData.get("habitId"),
      restartReason: formData.get("restartReason"),
    });

    if (!parsed.success) {
      return buildRedirect(request, "/dashboard?error=Select%20a%20restart%20reason.");
    }

    try {
      restartHabit(user.id, parsed.data.habitId, parsed.data.restartReason);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log that restart right now.";
      return buildRedirect(request, `/dashboard?error=${encodeURIComponent(message)}`);
    }
  } else {
    return buildRedirect(request, returnTo);
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  revalidatePath("/history");
  return buildRedirect(request, returnTo);
}
