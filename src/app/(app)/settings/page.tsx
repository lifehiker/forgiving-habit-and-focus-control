import Link from "next/link";

import { getLatestExtensionToken } from "@/lib/app";
import { readStore } from "@/lib/store";
import { requireUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Settings",
  path: "/settings",
});

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const latestToken = getLatestExtensionToken(user.id);
  const snapshot = readStore();
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
      <form action="/api/forms/settings" className="glass rounded-[1.85rem] p-6" method="post">
        {error ? (
          <div className="mb-5 rounded-[1.2rem] border border-[var(--danger)]/20 bg-[var(--accent-soft)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">Profile</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input className="field" defaultValue={user.name} id="name" name="name" type="text" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="timezone">
              Timezone
            </label>
            <input className="field" defaultValue={user.timezone} id="timezone" name="timezone" type="text" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="resetHour">
              Reset hour
            </label>
            <input className="field" defaultValue={user.resetHour} id="resetHour" max={23} min={0} name="resetHour" type="number" />
          </div>
          <label className="flex items-center gap-3 rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4 text-sm">
            <input defaultChecked={user.allowEmergencyOverride} name="allowEmergencyOverride" type="checkbox" />
            Allow emergency override during focus sessions
          </label>
          <button className="button-primary" type="submit">
            Save settings
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <section className="rounded-[1.85rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow)]">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Extension</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Manage your blocklist and generate an extension token for the local Chrome extension scaffold.
          </p>
          <p className="mt-4 text-sm">
            Current token: <span className="font-mono">{latestToken ?? "Not generated yet"}</span>
          </p>
          <Link className="button-secondary mt-4 px-4 py-2 text-sm" href="/settings/blocklist">
            Open blocklist settings
          </Link>
        </section>
        <section className="glass rounded-[1.85rem] p-6">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Email log</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
            {snapshot.emailLogs.filter((email) => email.userId === user.id).length ? (
              snapshot.emailLogs
                .filter((email) => email.userId === user.id)
                .slice(-5)
                .reverse()
                .map((email) => (
                  <div key={email.id} className="rounded-[1.2rem] border border-[var(--line)] bg-white/70 p-4">
                    <p className="font-semibold text-[var(--foreground)]">{email.type}</p>
                    <p>{email.preview}</p>
                  </div>
                ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-[var(--line)] bg-white/50 p-4">
                No lifecycle emails have been generated for this account yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
