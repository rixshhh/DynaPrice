import { USER_ROLES, UserRole } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SignupInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function parseSignupInput(input: unknown): SignupInput {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid request body.");
  }

  const { email, name, password, role } = input as Record<string, unknown>;
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) throw new Error("A valid email is required.");
  if (typeof name !== "string" || name.trim().length < 2) throw new Error("Name must be at least 2 characters.");
  if (typeof password !== "string" || password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (typeof role !== "string" || !USER_ROLES.includes(role as UserRole)) throw new Error("Role must be Admin or Seller.");

  return { email, name, password, role: role as UserRole };
}

export function parseLoginInput(input: unknown): LoginInput {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid request body.");
  }

  const { email, password } = input as Record<string, unknown>;
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) throw new Error("A valid email is required.");
  if (typeof password !== "string" || password.length < 1) throw new Error("Password is required.");

  return { email, password };
}
