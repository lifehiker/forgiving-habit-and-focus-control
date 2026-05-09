import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isServerActionRequest(request: NextRequest) {
  return request.method === "POST" && Boolean(request.headers.get("next-action"));
}

export function proxy(request: NextRequest) {
  if (!isServerActionRequest(request)) {
    return NextResponse.next();
  }

  const refreshUrl = request.nextUrl.clone();
  refreshUrl.searchParams.set("refresh", "1");

  return NextResponse.redirect(refreshUrl, {
    status: 303,
    headers: {
      "Cache-Control": "no-store",
      "X-Forge-Server-Action-Guard": "stale-request-redirect",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
