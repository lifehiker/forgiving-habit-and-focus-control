import { NextResponse } from "next/server";

export function buildRedirect(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export function getReturnTo(formData: FormData, fallback: string) {
  const value = formData.get("returnTo");
  return typeof value === "string" && value.startsWith("/") ? value : fallback;
}
