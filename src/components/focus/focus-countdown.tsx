"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatRemaining(endsAt: string) {
  const remainingMs = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FocusCountdown({
  endsAt,
  label,
}: {
  endsAt: string;
  label: string;
}) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(() => formatRemaining(endsAt));

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = formatRemaining(endsAt);
      setRemaining(next);
      if (next === "00:00") {
        window.clearInterval(interval);
        router.refresh();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endsAt, router]);

  return (
    <div className="rounded-[1.8rem] border border-white/15 bg-white/10 p-6 text-white shadow-[var(--shadow)]">
      <p className="eyebrow text-xs text-white/70">Commitment mode</p>
      <p className="mt-3 text-4xl font-semibold tabular-nums">{remaining}</p>
      <p className="mt-3 text-sm text-white/75">
        You committed to <span className="font-semibold text-white">{label}</span>. The block
        ends when the timer reaches zero.
      </p>
    </div>
  );
}
