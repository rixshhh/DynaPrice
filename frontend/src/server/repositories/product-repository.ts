import type { DemandSnapshot, OrderLine, PriceHistory, Product } from "@/server/domain/models";

export interface ProductLookupFilters {
  sellerId?: string;
  category?: string;
  search?: string;
}

export interface CreateProductInput {
  name: string;
  basePrice: number;
  category: string;
  stock: number;
  competitorPrice?: number | null;
  demandScore?: number;
  sellerId: string;
}

export interface RecordPriceHistoryInput {
  productId: string;
  computedPrice: number;
  basePrice: number;
  competitorPrice?: number | null;
  demandScore: number;
  modelVersion: string;
  createdAt?: Date;
}

export interface RecordOrderLineInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  soldAt?: Date;
  channel?: string | null;
}

export interface RecordDemandSnapshotInput {
  productId: string;
  demandScore: number;
  observedAt?: Date;
  source?: string | null;
}

export interface HistoryQuery {
  productId: string;
  take?: number;
  from?: Date;
  to?: Date;
}

export interface ProductRepository {
  create(input: CreateProductInput): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  lookup(filters?: ProductLookupFilters): Promise<Product[]>;
  listBySeller(sellerId: string): Promise<Product[]>;
  recordPriceHistory(input: RecordPriceHistoryInput): Promise<PriceHistory>;
  getPriceHistory(query: HistoryQuery): Promise<PriceHistory[]>;
  recordOrderLine(input: RecordOrderLineInput): Promise<OrderLine>;
  listOrderLines(query: HistoryQuery): Promise<OrderLine[]>;
  recordDemandSnapshot(input: RecordDemandSnapshotInput): Promise<DemandSnapshot>;
  listDemandSnapshots(query: HistoryQuery): Promise<DemandSnapshot[]>;
}
