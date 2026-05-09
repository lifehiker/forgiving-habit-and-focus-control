import { revalidatePath } from "next/cache";

import { updateProfile } from "@/lib/app";
import { buildRedirect } from "@/lib/form-routes";
import { requireUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();

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
    return buildRedirect(request, `/settings?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return buildRedirect(request, "/settings");
}
