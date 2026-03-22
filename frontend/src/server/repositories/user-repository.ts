import type { User, UserRole } from "@/server/domain/models";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export interface UpdateUserRoleInput {
  userId: string;
  role: UserRole;
}

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateRole(input: UpdateUserRoleInput): Promise<User>;
}
