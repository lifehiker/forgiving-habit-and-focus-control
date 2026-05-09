"use client";

import { useActionState } from "react";

import { requestLoginCode } from "@/lib/actions/auth";

const initialState: { error?: string; previewCode?: string } = {};

export function LoginRequestForm({ email }: { email?: string }) {
  const [state, formAction, pending] = useActionState(requestLoginCode, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-white/80 p-6">
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
      <button className="button-primary w-full" disabled={pending} type="submit">
        {pending ? "Sending code..." : "Send sign-in code"}
      </button>
      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      {state.previewCode ? (
        <div className="rounded-[1.25rem] bg-[var(--primary-soft)] p-4 text-sm text-[var(--primary-strong)]">
          Local preview code: <span className="font-semibold">{state.previewCode}</span>
        </div>
      ) : null}
    </form>
  );
}
