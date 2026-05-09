import Link from "next/link";

import type { AppUser } from "@/lib/types";

export function DashboardHeader({
  user,
  activeSessionLabel,
}: {
  user: AppUser;
  activeSessionLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,#17382f_0%,#265d49_45%,#f08f56_140%)] px-6 py-8 text-[#fff8f1] shadow-[var(--shadow)]">
      <div className="hero-noise absolute inset-0" />
      <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-end">
        <div className="space-y-4">
          <p className="eyebrow text-xs text-white/70">Daily reset</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
            Keep the routine warm, even when consistency gets messy.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-white/78">
            {user.rebuildGoal
              ? `You’re rebuilding ${user.rebuildGoal.toLowerCase()}.`
              : "You’re building a calmer system for showing back up."} The goal is
            momentum, not perfection.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/focus" className="button-primary bg-white/16 text-white">
              Start a focus block
            </Link>
            <Link href="/habits" className="button-secondary border-white/15 bg-white/10 text-white">
              Adjust habits
            </Link>
          </div>
        </div>
        <div className="rounded-[1.7rem] border border-white/14 bg-white/10 p-5">
          <p className="text-sm text-white/68">Right now</p>
          <p className="mt-2 text-2xl font-semibold">
            {activeSessionLabel ?? "No active focus session"}
          </p>
          <p className="mt-3 text-sm leading-7 text-white/74">
            Today is designed to be under 30 seconds unless you choose deeper focus.
          </p>
        </div>
      </div>
    </section>
  );
}
