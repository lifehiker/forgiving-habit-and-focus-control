import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "forging-habit-extension-api",
    timestamp: new Date().toISOString(),
  });
}
