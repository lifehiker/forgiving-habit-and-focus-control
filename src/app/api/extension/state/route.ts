import { NextResponse } from "next/server";

import { getExtensionPayload, validateExtensionToken } from "@/lib/app";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const token = bearerToken ?? url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing extension token." }, { status: 401 });
  }

  const userId = validateExtensionToken(token);
  if (!userId) {
    return NextResponse.json({ error: "Invalid extension token." }, { status: 401 });
  }

  const payload = getExtensionPayload(userId);
  return NextResponse.json(payload ?? { session: null, blockedDomains: [] });
}
