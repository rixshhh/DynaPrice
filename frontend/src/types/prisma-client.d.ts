declare module "@prisma/client" {
  export type UserRole = "ADMIN" | "SELLER" | "ANALYST";

  export interface DecimalLike {
    toNumber(): number;
  }

  export interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Product {
    id: string;
    name: string;
    basePrice: DecimalLike;
    category: string;
    stock: number;
    competitorPrice: DecimalLike | null;
    demandScore: DecimalLike;
    sellerId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface PriceHistory {
    id: string;
    productId: string;
    computedPrice: DecimalLike;
    basePrice: DecimalLike;
    competitorPrice: DecimalLike | null;
    demandScore: DecimalLike;
    modelVersion: string;
    createdAt: Date;
  }

  export interface OrderLine {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: DecimalLike;
    soldAt: Date;
    channel: string | null;
    createdAt: Date;
  }

  export interface DemandSnapshot {
    id: string;
    productId: string;
    demandScore: DecimalLike;
    observedAt: Date;
    source: string | null;
    createdAt: Date;
  }

  export namespace Prisma {
    export interface ProductWhereInput {
      sellerId?: string;
      category?: string;
      name?: {
        contains: string;
        mode: "insensitive";
      };
    }
  }

  export class PrismaClient {
    constructor(options?: unknown);
    user: any;
    product: any;
    priceHistory: any;
    orderLine: any;
    demandSnapshot: any;
  }
}
