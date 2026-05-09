import Link from "next/link";

import { getHistoryEvents } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "History",
  path: "/history",
});

const filters = [
  { key: "all", label: "All" },
  { key: "habit", label: "Habits" },
  { key: "lapse", label: "Lapses" },
  { key: "focus", label: "Focus" },
] as const;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const requestedFilter = typeof params.filter === "string" ? params.filter : "all";
  const canFilter = user.subscription.plan !== "free";
  const filter = canFilter ? requestedFilter : "all";
  const events = getHistoryEvents(user.id).filter((event) => filter === "all" || event.type === filter);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">History</p>
          <h1 className="mt-2 text-3xl font-semibold">Completions, lapses, restarts, and focus sessions.</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((entry) => (
            <Link
              key={entry.key}
              className={
                filter === entry.key
                  ? "button-primary px-4 py-2 text-sm"
                  : "button-secondary px-4 py-2 text-sm"
              }
              href={
                canFilter
                  ? entry.key === "all"
                    ? "/history"
                    : `/history?filter=${entry.key}`
                  : "/billing"
              }
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
      {!canFilter ? (
        <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted-foreground)]">
          History filters are part of Pro. Free users can still review the combined momentum log.
        </div>
      ) : null}
      <div className="glass rounded-[1.9rem] p-6">
        <div className="space-y-3">
          {events.length ? (
            events.map((event) => (
              <div key={event.id} className="rounded-[1.3rem] border border-[var(--line)] bg-white/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{event.type}</p>
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{event.detail}</p>
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">{new Date(event.date).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.3rem] border border-dashed border-[var(--line)] bg-white/50 p-4 text-sm text-[var(--muted-foreground)]">
              No events yet. Complete a habit or start a focus session to create your first momentum log entry.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
