import type { PrismaClient } from "@prisma/client";
import { mapUser } from "./mappers";
import type { CreateUserInput, UpdateUserRoleInput, UserRepository } from "@/server/repositories/user-repository";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateUserInput) {
    const record = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      },
    });

    return mapUser(record);
  }

  async findById(id: string) {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? mapUser(record) : null;
  }

  async findByEmail(email: string) {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? mapUser(record) : null;
  }

  async updateRole(input: UpdateUserRoleInput) {
    const record = await this.prisma.user.update({
      where: { id: input.userId },
      data: { role: input.role },
    });

    return mapUser(record);
  }
}
