export const USER_ROLES = ["Admin", "Seller"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type PasswordHashAlgorithm = "scrypt";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  passwordAlgorithm: PasswordHashAlgorithm;
  createdAt: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
