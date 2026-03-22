import { applyRateLimit } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rateLimited = await applyRateLimit(request, ["global", "auth"]);

  if (rateLimited) {
    return rateLimited;
  }

  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "email and password are required." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Authenticated." });
}
