import Link from "next/link";

import type { SeoLandingPage } from "@/lib/content";

export function SeoLandingPageView({ page }: { page: SeoLandingPage }) {
  return (
    <section className="shell space-y-8">
      <div className="rounded-[2.2rem] border border-[var(--border)] bg-[var(--card-strong)] p-8 shadow-[var(--shadow)]">
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          {page.hero}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
          {page.summary}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {page.bullets.map((bullet) => (
          <div key={bullet} className="glass rounded-[1.6rem] p-5 text-sm leading-7 text-[var(--muted-foreground)]">
            {bullet}
          </div>
        ))}
      </div>
      <div className="rounded-[1.8rem] border border-[var(--border)] bg-white/75 p-6 text-sm leading-7 text-[var(--muted-foreground)]">
        Start with the <Link className="font-semibold text-[var(--foreground)]" href="/login">free plan</Link>, explore{" "}
        <Link className="font-semibold text-[var(--foreground)]" href="/pricing">pricing</Link>, or read the{" "}
        <Link className="font-semibold text-[var(--foreground)]" href="/blog">blog</Link> for deeper recovery-first habit ideas.
      </div>
    </section>
  );
}
