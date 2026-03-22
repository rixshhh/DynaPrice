import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SCRYPT_KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, expected] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !expected) {
    return false;
  }

  const actual = scryptSync(password, salt, SCRYPT_KEYLEN);
  const expectedBuffer = Buffer.from(expected, "hex");

  return expectedBuffer.length === actual.length && timingSafeEqual(expectedBuffer, actual);
}

export async function verifyPasswordAgainstFallback(password: string): Promise<void> {
  const fallbackHash = await hashPassword("invalid-password-fallback");
  await verifyPassword(password, fallbackHash);
}
