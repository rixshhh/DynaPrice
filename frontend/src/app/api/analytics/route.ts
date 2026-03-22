import { NextRequest, NextResponse } from "next/server";
import { requireRoles } from "@/lib/auth/guards";

export async function GET(request: NextRequest) {
  const auth = await requireRoles(request, ["Admin"]);
  if (auth instanceof NextResponse) {
    return auth;
  }

  return NextResponse.json({
    message: "Analytics data loaded.",
    actor: auth,
    permissions: ["analytics:read", "reports:export"],
  });
}
