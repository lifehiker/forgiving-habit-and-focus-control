import { revalidatePath } from "next/cache";

import { maybeSendUpgradeEmail } from "@/lib/app";
import { trackEvent } from "@/lib/analytics";
import { syncLocalSubscription } from "@/lib/billing";
import { buildRedirect } from "@/lib/form-routes";
import { requireUser } from "@/lib/session";
import type { SubscriptionPlan } from "@/lib/types";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const plan = String(formData.get("plan")) as SubscriptionPlan;
  syncLocalSubscription(user.id, plan);

  if (plan !== "free") {
    trackEvent("subscription_activated", user.id, { plan });
    maybeSendUpgradeEmail(user.id, user.email, plan);
  }

  revalidatePath("/billing");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return buildRedirect(request, "/billing");
}
