import Link from "next/link";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16">
      <header className="shell flex items-center justify-between gap-4 py-5">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Forging Habit
        </Link>
        <nav className="hidden gap-3 text-sm text-[var(--muted-foreground)] md:flex">
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/focus-session-app">Focus sessions</Link>
          <Link href="/login" className="button-secondary px-4 py-2 text-[var(--foreground)]">
            Sign in
          </Link>
        </nav>
      </header>
      {children}
      <footer className="shell mt-16 border-t border-[var(--line)] py-8 text-sm text-[var(--muted-foreground)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>Built for people who restart often and still want real focus.</p>
          <div className="flex gap-4">
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/habit-tracker-adhd">ADHD habits</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
