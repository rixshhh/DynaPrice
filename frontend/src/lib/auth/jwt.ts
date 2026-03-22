import { createHmac, timingSafeEqual } from "crypto";
import { AuthTokenPayload, UserRole } from "./types";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-jwt-secret-change-me";
const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 60 * 60);

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(normalized + "=".repeat(padding), "base64");
}

export async function issueAccessToken(input: { sub: string; email: string; role: UserRole }) {
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthTokenPayload = {
    sub: input.sub,
    email: input.email,
    role: input.role,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();

  return `${encodedHeader}.${encodedPayload}.${base64url(signature)}`;
}

export async function verifyAccessToken(token: string): Promise<AuthTokenPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const expectedSignature = createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  const actualSignature = fromBase64url(encodedSignature);

  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
    return null;
  }

  const payload = JSON.parse(fromBase64url(encodedPayload).toString("utf8")) as AuthTokenPayload;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= now) return null;
  return payload;
}
