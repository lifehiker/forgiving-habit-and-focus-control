"use server";

import { revalidatePath } from "next/cache";

import { maybeSendUpgradeEmail } from "@/lib/app";
import { trackEvent } from "@/lib/analytics";
import { syncLocalSubscription } from "@/lib/billing";
import { requireUser } from "@/lib/session";
import type { SubscriptionPlan } from "@/lib/types";

export async function updatePlanAction(formData: FormData) {
  const user = await requireUser();
  const plan = String(formData.get("plan")) as SubscriptionPlan;
  syncLocalSubscription(user.id, plan);

  if (plan !== "free") {
    trackEvent("subscription_activated", user.id, { plan });
    maybeSendUpgradeEmail(user.id, user.email, plan);
  }

  revalidatePath("/billing");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}
