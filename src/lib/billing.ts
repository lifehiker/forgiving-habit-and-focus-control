import { mutateStore, readStore } from "@/lib/store";
import type { AppUser, SubscriptionPlan } from "@/lib/types";
import { createId } from "@/lib/utils";

export function getUserSubscription(userId: string) {
  const data = readStore();
  return (
    data.subscriptions.find((subscription) => subscription.userId === userId) ?? {
      id: createId("sub"),
      userId,
      plan: "free" as const,
      status: "free" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
}

export function isPro(user: AppUser) {
  return user.subscription.plan !== "free" && user.subscription.status !== "canceled";
}

export function requirePro(user: AppUser) {
  if (!isPro(user)) {
    throw new Error("This feature requires Pro.");
  }
}

export function syncLocalSubscription(userId: string, plan: SubscriptionPlan) {
  mutateStore((data) => {
    const existing = data.subscriptions.find(
      (subscription) => subscription.userId === userId,
    );
    const user = data.users.find((entry) => entry.id === userId);
    const status = plan === "free" ? "free" : "active";
    const currentPeriodEnd =
      plan === "free"
        ? undefined
        : new Date(
            Date.now() + (plan === "pro-yearly" ? 365 : 30) * 24 * 60 * 60 * 1000,
          ).toISOString();

    if (user) {
      user.allowEmergencyOverride = plan === "free";
      user.updatedAt = new Date().toISOString();
    }

    if (existing) {
      existing.plan = plan;
      existing.status = status;
      existing.currentPeriodEnd = currentPeriodEnd;
      existing.updatedAt = new Date().toISOString();
      return;
    }

    data.subscriptions.push({
      id: createId("sub"),
      userId,
      plan,
      status,
      currentPeriodEnd,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
}
