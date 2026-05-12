import { revalidatePath } from "next/cache";

import { finishFocusSession, startFocusSession } from "@/lib/app";
import { buildRedirect } from "@/lib/form-routes";
import { requireUser } from "@/lib/session";
import { focusCompletionSchema, focusSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "start") {
    const parsed = focusSchema.safeParse({
      label: formData.get("label"),
      durationMinutes: formData.get("durationMinutes"),
      habitId: formData.get("habitId") || undefined,
    });

    if (!parsed.success) {
      return buildRedirect(request, "/focus?error=Please%20check%20the%20focus%20session%20form.");
    }

    try {
      startFocusSession(user, parsed.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start that focus session.";
      return buildRedirect(request, `/focus?error=${encodeURIComponent(message)}`);
    }
  } else if (intent === "complete") {
    const parsed = focusCompletionSchema.safeParse({
      sessionId: formData.get("sessionId"),
    });
    if (!parsed.success) {
      return buildRedirect(request, "/focus?error=That%20focus%20session%20request%20was%20invalid.");
    }
    try {
      finishFocusSession(user, parsed.data.sessionId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to complete that focus session.";
      return buildRedirect(request, `/focus?error=${encodeURIComponent(message)}`);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/focus");
  revalidatePath("/history");
  return buildRedirect(request, "/focus");
}
