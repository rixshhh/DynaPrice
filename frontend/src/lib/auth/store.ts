import { randomUUID } from "crypto";
import { AuthUser, UserRole } from "./types";

const users = new Map<string, AuthUser>();

export function findUserByEmail(email: string): AuthUser | undefined {
  return users.get(email.trim().toLowerCase());
}

export function createUser(input: {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
}): AuthUser {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user: AuthUser = {
    id: randomUUID(),
    email: normalizedEmail,
    name: input.name.trim(),
    role: input.role,
    passwordHash: input.passwordHash,
    passwordAlgorithm: "scrypt",
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);
  return user;
}

export function listUsers(): AuthUser[] {
  return [...users.values()];
}
