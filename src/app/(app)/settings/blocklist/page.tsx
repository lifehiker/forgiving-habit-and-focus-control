import { addBlockedDomainAction, generateExtensionTokenAction, removeBlockedDomainAction } from "@/lib/actions/extension";
import { getActiveBlockedDomains, getLatestExtensionToken } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blocklist",
  path: "/settings/blocklist",
});

export default async function BlocklistPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const domains = getActiveBlockedDomains(user.id);
  const token = getLatestExtensionToken(user.id);
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="glass rounded-[1.85rem] p-6">
        {error ? (
          <div className="mb-5 rounded-[1.2rem] border border-[var(--danger)]/20 bg-[var(--accent-soft)] p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">Blocked domains</p>
        <div className="mt-5 space-y-3">
          {domains.length ? (
            domains.map((domain) => (
              <div key={domain.id} className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-4">
                <span className="font-semibold">{domain.domain}</span>
                <form action={removeBlockedDomainAction}>
                  <input name="domainId" type="hidden" value={domain.id} />
                  <button className="button-ghost px-4 py-2 text-sm" type="submit">
                    Remove
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">No blocked domains yet.</p>
          )}
        </div>
      </section>

      <div className="space-y-6">
        <form action={addBlockedDomainAction} className="rounded-[1.85rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow)]">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Add domain</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input className="field" name="domain" placeholder="youtube.com" required type="text" />
            <button className="button-primary" type="submit">
              Add
            </button>
          </div>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Free plan users can keep up to 3 active blocked domains.
          </p>
        </form>
        <section className="glass rounded-[1.85rem] p-6">
          <p className="eyebrow text-xs text-[var(--muted-foreground)]">Extension token</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            The local Manifest V3 scaffold in `extension/` reads this token and polls the app for active session state.
          </p>
          <p className="mt-4 rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-4 font-mono text-sm">
            {token ?? "Generate a token to connect the extension."}
          </p>
          <form action={generateExtensionTokenAction} className="mt-4">
            <button className="button-primary" type="submit">
              Generate token
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
