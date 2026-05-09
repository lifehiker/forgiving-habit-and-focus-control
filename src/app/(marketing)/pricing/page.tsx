import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  path: "/pricing",
  keywords: ["habit tracker pricing", "focus blocker pricing", "freemium focus app"],
});

const plans = [
  {
    name: "Free",
    price: "$0",
    detail: "For testing the restart loop",
    features: [
      "Up to 3 active habits",
      "5 focus sessions every 7 days",
      "Basic momentum dashboard",
      "Up to 3 blocked domains",
      "Override friction enabled",
    ],
  },
  {
    name: "Pro Monthly",
    price: "$7.99",
    detail: "Flexible monthly commitment",
    features: [
      "Unlimited habits and focus sessions",
      "Unlimited blocked domains",
      "Linked habits ↔ focus sessions",
      "Full history filters",
      "Strict commitment mode",
    ],
  },
  {
    name: "Pro Yearly",
    price: "$59",
    detail: "Best default for consistent use",
    features: [
      "Everything in Pro",
      "Annual pricing emphasis from the PRD",
      "Lifecycle restart and upgrade email support",
      "Best option for long-term use",
      "Local fallback billing works without Stripe keys",
    ],
  },
];

export default function PricingPage() {
  return (
    <section className="shell space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">Pricing</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Start free. Upgrade when you want stronger commitment mode.
        </h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">
          The free tier is enough to prove the restart system works for you. Pro unlocks unlimited
          habits, unlimited focus sessions, custom blocking depth, and stricter override controls.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="glass rounded-[2rem] p-6">
            <p className="eyebrow text-xs text-[var(--muted-foreground)]">{plan.name}</p>
            <p className="mt-4 text-4xl font-semibold">{plan.price}</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{plan.detail}</p>
            <ul className="mt-5 space-y-3 text-sm text-[var(--muted-foreground)]">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
