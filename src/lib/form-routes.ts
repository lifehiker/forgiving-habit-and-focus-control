import { NextResponse } from "next/server";

export function buildRedirect(_request: Request, path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: path,
    },
  });
}

export function getReturnTo(formData: FormData, fallback: string) {
  const value = formData.get("returnTo");
  return typeof value === "string" && value.startsWith("/") ? value : fallback;
}
