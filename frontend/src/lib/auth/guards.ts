import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./jwt";
import { AuthTokenPayload, UserRole } from "./types";

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function authenticateRequest(request: NextRequest): Promise<AuthTokenPayload | NextResponse> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return unauthorized("Missing bearer token.");
  }

  const token = authorization.slice("Bearer ".length).trim();
  const payload = await verifyAccessToken(token);
  if (!payload) {
    return unauthorized("Invalid or expired token.");
  }

  return payload;
}

export async function requireRoles(
  request: NextRequest,
  allowedRoles: UserRole[],
): Promise<AuthTokenPayload | NextResponse> {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  if (!allowedRoles.includes(auth.role)) {
    return forbidden(`Requires one of the following roles: ${allowedRoles.join(", ")}.`);
  }

  return auth;
}
