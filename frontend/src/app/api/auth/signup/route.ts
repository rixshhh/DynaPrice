import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth/store";
import { issueAccessToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { parseSignupInput } from "@/lib/auth/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = parseSignupInput(body);

    if (findUserByEmail(input.email)) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(input.password);
    const user = createUser({
      email: input.email,
      name: input.name,
      role: input.role,
      passwordHash,
    });

    const accessToken = await issueAccessToken({ sub: user.id, email: user.email, role: user.role });

    return NextResponse.json(
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
