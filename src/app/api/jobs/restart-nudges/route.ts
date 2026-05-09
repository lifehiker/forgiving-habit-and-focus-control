import { NextResponse } from "next/server";

import { runRestartNudges } from "@/lib/app";

export async function POST(request: Request) {
  const configuredSecret = process.env.RESTART_NUDGE_SECRET;
  const providedSecret = request.headers.get("x-restart-nudge-secret");

  if (configuredSecret && providedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sentTo = runRestartNudges();
  return NextResponse.json({ sentTo, count: sentTo.length });
}
