import {
  PriceComputationInput,
  PriceHistoryRecord,
  ProductRecord,
} from "@/pricing/types";

const products = new Map<string, ProductRecord>([
  [
    "prod_analytics_suite",
    {
      id: "prod_analytics_suite",
      name: "Analytics Suite",
      baseCost: 72,
      currentPrice: 124,
      demandScore: 0.82,
      competitorPricing: [118, 121, 129],
      historicalPrices: [112, 117, 119, 123],
      constraints: { minMargin: 0.2, maxMargin: 0.65 },
    },
  ],
  [
    "prod_edge_sensor",
    {
      id: "prod_edge_sensor",
      name: "Edge Sensor",
      baseCost: 41,
      currentPrice: 79,
      demandScore: 0.61,
      competitorPricing: [75, 80, 78],
      historicalPrices: [70, 72, 76, 77],
      constraints: { minMargin: 0.18, maxMargin: 0.55 },
    },
  ],
]);

const priceHistory: PriceHistoryRecord[] = [];

export function getProductById(productId: string) {
  return products.get(productId);
}

export function updateProductSnapshot(
  productId: string,
  input: Partial<PriceComputationInput> & { currentPrice?: number },
) {
  const product = products.get(productId);

  if (!product) {
    return undefined;
  }

  const updatedProduct: ProductRecord = {
    ...product,
    demandScore: input.demandScore ?? product.demandScore,
    competitorPricing: input.competitorPricing ?? product.competitorPricing,
    historicalPrices: input.historicalData ?? product.historicalPrices,
    currentPrice: input.currentPrice ?? product.currentPrice,
    baseCost: input.baseCost ?? product.baseCost,
    constraints: input.constraints ?? product.constraints,
  };

  products.set(productId, updatedProduct);
  return updatedProduct;
}

export function addPriceHistoryEntry(entry: PriceHistoryRecord) {
  priceHistory.unshift(entry);
}

export function getPriceHistoryByProductId(productId: string) {
  return priceHistory.filter((entry) => entry.productId === productId);
}
