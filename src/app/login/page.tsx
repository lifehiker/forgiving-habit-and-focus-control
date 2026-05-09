import { redirect } from "next/navigation";

import { LoginRequestForm } from "@/components/login-request-form";
import { verifyLoginCode } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/session";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  path: "/login",
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.onboardingCompleted ? "/dashboard" : "/onboarding");
  }

  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : undefined;
  const error = params.error === "invalid-code" ? "That code is invalid or expired." : null;

  return (
    <div className="shell grid gap-8 py-8 md:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,#17382f_0%,#265d49_45%,#f08f56_140%)] p-8 text-white shadow-[var(--shadow)]">
        <p className="eyebrow text-xs text-white/72">Email sign-in</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Start where you are. Restart from there.</h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-white/78">
          The MVP uses local email code sign-in and safe fallbacks for missing external credentials.
          If email delivery is unavailable, you will see a preview code on the form.
        </p>
      </section>

      <div className="space-y-5">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold">Google sign-in</p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            Google OAuth is part of the PRD, but this build runs safely without external credentials.
          </p>
          <button className="button-secondary mt-4 w-full opacity-70" disabled type="button">
            Google sign-in requires credentials
          </button>
        </div>
        <LoginRequestForm email={email} />
        <form action={verifyLoginCode} className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="verify-email">
              Email
            </label>
            <input className="field" defaultValue={email} id="verify-email" name="email" required type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="verify-code">
              6-digit code
            </label>
            <input className="field" id="verify-code" inputMode="numeric" name="code" required type="text" />
          </div>
          <button className="button-primary w-full" type="submit">
            Verify and continue
          </button>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
