import { NextRequest, NextResponse } from "next/server";
import { issueAccessToken } from "@/lib/auth/jwt";
import { verifyPassword, verifyPasswordAgainstFallback } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/auth/store";
import { parseLoginInput } from "@/lib/auth/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = parseLoginInput(body);
    const user = findUserByEmail(input.email);

    if (!user) {
      await verifyPasswordAgainstFallback(input.password);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const accessToken = await issueAccessToken({ sub: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
