import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getCurrentRenewalLabel } from "@/lib/app";
import { getCurrentUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Billing",
  path: "/billing",
});

const planLabels = {
  free: "Free",
  "pro-monthly": "Pro Monthly",
  "pro-yearly": "Pro Yearly",
} as const;

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="shell py-16">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="mt-6 text-[var(--muted-foreground)]">
          Sign in to view and manage your subscription plan.
        </p>
        <Link className="button-primary mt-6 inline-flex" href="/login">
          Sign in
        </Link>
      </div>
    );
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <AppShell user={user}>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="glass rounded-[1.85rem] p-6">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Current plan</p>
          <h1 className="mt-3 text-3xl font-semibold">{planLabels[user.subscription.plan]}</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Renewal date: {getCurrentRenewalLabel(user)}. This MVP uses local subscription switching when Stripe credentials are unavailable, while still exposing the full billing UI path.
          </p>
          <button className="button-secondary mt-4 opacity-70" disabled type="button">
            Manage subscription requires Stripe credentials
          </button>
        </section>
        <div className="grid gap-4 md:grid-cols-3">
          {(["free", "pro-monthly", "pro-yearly"] as const).map((plan) => (
            <form key={plan} action="/api/forms/billing" className="rounded-[1.7rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow)]" method="post">
              <input name="plan" type="hidden" value={plan} />
              <p className="eyebrow text-xs text-[var(--muted-foreground)]">{planLabels[plan]}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                {plan === "free"
                  ? "3 habits, 5 weekly focus sessions, 3 blocked domains."
                  : plan === "pro-monthly"
                    ? "Unlimited access with monthly billing."
                    : "Unlimited access with annual pricing emphasis."}
              </p>
              <button
                className={user.subscription.plan === plan ? "button-secondary mt-5 w-full" : "button-primary mt-5 w-full"}
                type="submit"
              >
                {user.subscription.plan === plan ? "Current plan" : `Switch to ${planLabels[plan]}`}
              </button>
            </form>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
