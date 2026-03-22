export type UserRole = "ADMIN" | "SELLER" | "ANALYST";

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
  basePrice: number;
  category: string;
  stock: number;
  competitorPrice: number | null;
  demandScore: number;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceHistory {
  id: string;
  productId: string;
  computedPrice: number;
  basePrice: number;
  competitorPrice: number | null;
  demandScore: number;
  modelVersion: string;
  createdAt: Date;
}

export interface OrderLine {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  soldAt: Date;
  channel: string | null;
  createdAt: Date;
}

export interface DemandSnapshot {
  id: string;
  productId: string;
  demandScore: number;
  observedAt: Date;
  source: string | null;
  createdAt: Date;
}
