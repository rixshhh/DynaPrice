import type { Prisma, PrismaClient } from "@prisma/client";
import {
  mapDemandSnapshot,
  mapOrderLine,
  mapPriceHistory,
  mapProduct,
} from "./mappers";
import type {
  CreateProductInput,
  HistoryQuery,
  ProductLookupFilters,
  ProductRepository,
  RecordDemandSnapshotInput,
  RecordOrderLineInput,
  RecordPriceHistoryInput,
} from "@/server/repositories/product-repository";

const buildProductWhere = (
  filters?: ProductLookupFilters,
): Prisma.ProductWhereInput => ({
  sellerId: filters?.sellerId,
  category: filters?.category,
  ...(filters?.search
    ? {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      }
    : {}),
});

const buildHistoryWhere = (query: HistoryQuery) => ({
  productId: query.productId,
  createdAt:
    query.from || query.to
      ? {
          gte: query.from,
          lte: query.to,
        }
      : undefined,
});

const buildObservedAtWhere = (query: HistoryQuery) => ({
  productId: query.productId,
  observedAt:
    query.from || query.to
      ? {
          gte: query.from,
          lte: query.to,
        }
      : undefined,
});

const buildSoldAtWhere = (query: HistoryQuery) => ({
  productId: query.productId,
  soldAt:
    query.from || query.to
      ? {
          gte: query.from,
          lte: query.to,
        }
      : undefined,
});

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateProductInput) {
    const record = await this.prisma.product.create({
      data: input,
    });

    return mapProduct(record);
  }

  async findById(id: string) {
    const record = await this.prisma.product.findUnique({ where: { id } });
    return record ? mapProduct(record) : null;
  }

  async lookup(filters?: ProductLookupFilters) {
    const records = await this.prisma.product.findMany({
      where: buildProductWhere(filters),
      orderBy: [{ sellerId: "asc" }, { createdAt: "desc" }],
    });

    return records.map(mapProduct);
  }

  async listBySeller(sellerId: string) {
    const records = await this.prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
    });

    return records.map(mapProduct);
  }

  async recordPriceHistory(input: RecordPriceHistoryInput) {
    const record = await this.prisma.priceHistory.create({
      data: {
        ...input,
        createdAt: input.createdAt ?? new Date(),
      },
    });

    return mapPriceHistory(record);
  }

  async getPriceHistory(query: HistoryQuery) {
    const records = await this.prisma.priceHistory.findMany({
      where: buildHistoryWhere(query),
      orderBy: { createdAt: "desc" },
      take: query.take,
    });

    return records.map(mapPriceHistory);
  }

  async recordOrderLine(input: RecordOrderLineInput) {
    const record = await this.prisma.orderLine.create({
      data: {
        ...input,
        soldAt: input.soldAt ?? new Date(),
      },
    });

    return mapOrderLine(record);
  }

  async listOrderLines(query: HistoryQuery) {
    const records = await this.prisma.orderLine.findMany({
      where: buildSoldAtWhere(query),
      orderBy: { soldAt: "desc" },
      take: query.take,
    });

    return records.map(mapOrderLine);
  }

  async recordDemandSnapshot(input: RecordDemandSnapshotInput) {
    const record = await this.prisma.demandSnapshot.create({
      data: {
        ...input,
        observedAt: input.observedAt ?? new Date(),
      },
    });

    return mapDemandSnapshot(record);
  }

  async listDemandSnapshots(query: HistoryQuery) {
    const records = await this.prisma.demandSnapshot.findMany({
      where: buildObservedAtWhere(query),
      orderBy: { observedAt: "desc" },
      take: query.take,
    });

    return records.map(mapDemandSnapshot);
  }
}
