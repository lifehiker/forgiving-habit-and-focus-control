export function MomentumCard({
  currentMomentum,
  last7,
  last30,
}: {
  currentMomentum: number;
  last7: number;
  last30: number;
}) {
  return (
    <section className="glass rounded-[1.75rem] p-6">
      <p className="eyebrow text-xs text-[var(--muted-foreground)]">Momentum</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold">{currentMomentum}</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            A simple recovery-first signal, not a brittle streak.
          </p>
        </div>
        <div className="rounded-[1.4rem] bg-[var(--primary-soft)] px-4 py-3 text-right">
          <p className="text-sm text-[var(--primary-strong)]">Last 7 days</p>
          <p className="text-2xl font-semibold text-[var(--primary-strong)]">{last7}</p>
        </div>
      </div>
      <div className="mt-4 rounded-[1.4rem] border border-[var(--line)] p-4 text-sm text-[var(--muted-foreground)]">
        Completed days in the last 30: <span className="font-semibold text-[var(--foreground)]">{last30}</span>
      </div>
    </section>
  );
}
