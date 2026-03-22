export type BusinessConstraints = {
  minMargin?: number;
  maxMargin?: number;
};

export type ProductRecord = {
  id: string;
  name: string;
  baseCost: number;
  currentPrice: number;
  demandScore: number;
  competitorPricing: number[];
  historicalPrices: number[];
  constraints?: BusinessConstraints;
};

export type PriceComputationInput = {
  productId: string;
  demandScore: number;
  competitorPricing: number[];
  historicalData: number[];
  baseCost: number;
  currentPrice: number;
  constraints?: BusinessConstraints;
};

export type PriceHistoryRecord = {
  id: string;
  productId: string;
  computedPrice: number;
  demandScore: number;
  competitorAverage: number;
  historicalAverage: number;
  baseCost: number;
  currentPrice: number;
  usedFallback: boolean;
  reason: string;
  constraints?: BusinessConstraints;
  createdAt: string;
};

export type PriceComputationResult = {
  productId: string;
  computedPrice: number;
  demandScore: number;
  competitorAverage: number;
  historicalAverage: number;
  usedFallback: boolean;
  reason: string;
  constraints?: BusinessConstraints;
};
