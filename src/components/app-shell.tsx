"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/lib/actions/auth";
import type { AppUser } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/habits", label: "Habits" },
  { href: "/focus", label: "Focus" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
];

export function AppShell({
  user,
  children,
}: {
  user: AppUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="pb-14">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(248,243,234,0.86)] backdrop-blur-xl">
        <div className="shell flex items-center justify-between gap-4 py-4">
          <div>
            <Link href="/dashboard" className="text-xl font-semibold tracking-tight">
              Forging Habit
            </Link>
            <p className="text-sm text-[var(--muted-foreground)]">
              Restart-first habits and commitment-grade focus.
            </p>
          </div>
          <nav className="hidden flex-wrap gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
                    : "text-[var(--muted-foreground)] hover:bg-white/60",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs capitalize text-[var(--muted-foreground)]">
                {user.subscription.plan.replace("-", " ")}
              </p>
            </div>
            <form action={logout}>
              <button className="button-ghost text-sm" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="shell pt-8">{children}</main>
    </div>
  );
}
