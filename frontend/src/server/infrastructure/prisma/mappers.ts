import type {
  DemandSnapshot as DemandSnapshotRecord,
  OrderLine as OrderLineRecord,
  PriceHistory as PriceHistoryRecord,
  Product as ProductRecord,
  User as UserRecord,
} from "@prisma/client";
import type { DemandSnapshot, OrderLine, PriceHistory, Product, User } from "@/server/domain/models";

const toNumber = (value: { toNumber(): number } | number | null): number | null => {
  if (value === null) {
    return null;
  }

  return typeof value === "number" ? value : value.toNumber();
};

export const mapUser = (record: UserRecord): User => ({
  ...record,
});

export const mapProduct = (record: ProductRecord): Product => ({
  ...record,
  basePrice: toNumber(record.basePrice) ?? 0,
  competitorPrice: toNumber(record.competitorPrice),
  demandScore: toNumber(record.demandScore) ?? 0,
});

export const mapPriceHistory = (record: PriceHistoryRecord): PriceHistory => ({
  ...record,
  computedPrice: toNumber(record.computedPrice) ?? 0,
  basePrice: toNumber(record.basePrice) ?? 0,
  competitorPrice: toNumber(record.competitorPrice),
  demandScore: toNumber(record.demandScore) ?? 0,
});

export const mapOrderLine = (record: OrderLineRecord): OrderLine => ({
  ...record,
  unitPrice: toNumber(record.unitPrice) ?? 0,
});

export const mapDemandSnapshot = (
  record: DemandSnapshotRecord,
): DemandSnapshot => ({
  ...record,
  demandScore: toNumber(record.demandScore) ?? 0,
});
