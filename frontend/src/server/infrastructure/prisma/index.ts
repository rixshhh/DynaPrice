import { prisma } from "@/server/db-prisma";
import { PrismaProductRepository } from "./prisma-product-repository";
import { PrismaUserRepository } from "./prisma-user-repository";

export const repositories = {
  users: new PrismaUserRepository(prisma),
  products: new PrismaProductRepository(prisma),
};

export type RepositoryRegistry = typeof repositories;
