export function LoginRequestForm({
  email,
  requestError,
  previewCode,
}: {
  email?: string;
  requestError?: string | null;
  previewCode?: string | null;
}) {
  return (
    <form action="/api/forms/auth/request-code" className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6" method="post">
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="login-name">
          Name
        </label>
        <input
          className="field"
          defaultValue=""
          id="login-name"
          name="name"
          placeholder="Taylor"
          type="text"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="login-email">
          Email
        </label>
        <input
          className="field"
          defaultValue={email}
          id="login-email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <button className="button-primary w-full" type="submit">
        Send sign-in code
      </button>
      {requestError ? <p className="text-sm text-[var(--danger)]">{requestError}</p> : null}
      {previewCode ? (
        <div className="rounded-[1.25rem] bg-[var(--primary-soft)] p-4 text-sm text-[var(--primary-strong)]">
          Local preview code: <span className="font-semibold">{previewCode}</span>
        </div>
      ) : null}
    </form>
  );
}
