import { NextRequest, NextResponse } from "next/server";
import { requireRoles } from "@/lib/auth/guards";

export async function GET(request: NextRequest) {
  const auth = await requireRoles(request, ["Admin", "Seller"]);
  if (auth instanceof NextResponse) {
    return auth;
  }

  return NextResponse.json({
    message: "Product management data loaded.",
    actor: auth,
    permissions: ["catalog:read", "catalog:write", "inventory:update"],
  });
}
