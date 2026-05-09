import Link from "next/link";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16">
      <header className="shell py-5">
        <div className="flex items-center justify-between gap-4">
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
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-sm text-[var(--muted-foreground)] md:hidden">
          <Link className="button-secondary shrink-0 px-4 py-2 text-[var(--foreground)]" href="/pricing">
            Pricing
          </Link>
          <Link className="button-secondary shrink-0 px-4 py-2 text-[var(--foreground)]" href="/blog">
            Blog
          </Link>
          <Link className="button-secondary shrink-0 px-4 py-2 text-[var(--foreground)]" href="/focus-session-app">
            Focus sessions
          </Link>
          <Link className="button-primary shrink-0 px-4 py-2" href="/login">
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
