import {
  addPriceHistoryEntry,
  getPriceHistoryByProductId,
  getProductById,
  updateProductSnapshot,
} from "@/pricing/store";
import {
  PriceComputationInput,
  PriceComputationResult,
  PriceHistoryRecord,
  ProductRecord,
} from "@/pricing/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function clampByConstraints(
  candidatePrice: number,
  baseCost: number,
  minMargin?: number,
  maxMargin?: number,
) {
  const minAllowed = minMargin !== undefined ? baseCost * (1 + minMargin) : -Infinity;
  const maxAllowed = maxMargin !== undefined ? baseCost * (1 + maxMargin) : Infinity;

  return Math.min(Math.max(candidatePrice, minAllowed), maxAllowed);
}

async function getMlSuggestedPrice(input: PriceComputationInput) {
  if (input.demandScore < 0 || input.demandScore > 1) {
    throw new Error("Demand score must be between 0 and 1.");
  }

  const outageTrigger = process.env.PRICING_ML_UNAVAILABLE === "true";

  if (outageTrigger) {
    throw new Error("ML pricing service is unavailable.");
  }

  const competitorAverage = average(input.competitorPricing);
  const historicalAverage = average(input.historicalData);
  const demandPremiumFactor = 1 + (input.demandScore - 0.5) * 0.18;
  const blendedBaseline =
    input.currentPrice * 0.35 + competitorAverage * 0.4 + historicalAverage * 0.25;

  return roundCurrency(blendedBaseline * demandPremiumFactor);
}

export function computeFallbackPrice(input: PriceComputationInput) {
  const competitorAverage = average(input.competitorPricing);
  const historicalAverage = average(input.historicalData);
  const demandMultiplier = 0.85 + input.demandScore * 0.3;

  const fallback =
    (input.baseCost * 0.25 + competitorAverage * 0.45 + historicalAverage * 0.3) *
    demandMultiplier;

  return roundCurrency(fallback);
}

function buildHistoryRecord(
  result: PriceComputationResult,
  input: PriceComputationInput,
): PriceHistoryRecord {
  return {
    id: `${result.productId}-${Date.now()}`,
    productId: result.productId,
    computedPrice: result.computedPrice,
    demandScore: result.demandScore,
    competitorAverage: result.competitorAverage,
    historicalAverage: result.historicalAverage,
    baseCost: input.baseCost,
    currentPrice: input.currentPrice,
    usedFallback: result.usedFallback,
    reason: result.reason,
    constraints: result.constraints,
    createdAt: new Date().toISOString(),
  };
}

function normalizeProductToInput(product: ProductRecord): PriceComputationInput {
  return {
    productId: product.id,
    demandScore: product.demandScore,
    competitorPricing: product.competitorPricing,
    historicalData: product.historicalPrices,
    baseCost: product.baseCost,
    currentPrice: product.currentPrice,
    constraints: product.constraints,
  };
}

export async function calculateDynamicPrice(input: PriceComputationInput) {
  const competitorAverage = average(input.competitorPricing);
  const historicalAverage = average(input.historicalData);

  try {
    const mlPrice = await getMlSuggestedPrice(input);
    const computedPrice = roundCurrency(
      clampByConstraints(
        mlPrice,
        input.baseCost,
        input.constraints?.minMargin,
        input.constraints?.maxMargin,
      ),
    );

    const result: PriceComputationResult = {
      productId: input.productId,
      computedPrice,
      demandScore: input.demandScore,
      competitorAverage: roundCurrency(competitorAverage),
      historicalAverage: roundCurrency(historicalAverage),
      usedFallback: false,
      reason: "ML pricing signal blended with market and historical data.",
      constraints: input.constraints,
    };

    addPriceHistoryEntry(buildHistoryRecord(result, input));
    updateProductSnapshot(input.productId, { ...input, currentPrice: computedPrice });

    return result;
  } catch {
    const fallbackPrice = computeFallbackPrice(input);
    const computedPrice = roundCurrency(
      clampByConstraints(
        fallbackPrice,
        input.baseCost,
        input.constraints?.minMargin,
        input.constraints?.maxMargin,
      ),
    );

    const result: PriceComputationResult = {
      productId: input.productId,
      computedPrice,
      demandScore: input.demandScore,
      competitorAverage: roundCurrency(competitorAverage),
      historicalAverage: roundCurrency(historicalAverage),
      usedFallback: true,
      reason:
        "Fallback formula applied: (baseCost*0.25 + competitorAvg*0.45 + historicalAvg*0.30) * (0.85 + demandScore*0.30).",
      constraints: input.constraints,
    };

    addPriceHistoryEntry(buildHistoryRecord(result, input));
    updateProductSnapshot(input.productId, { ...input, currentPrice: computedPrice });

    return result;
  }
}

export async function getDynamicPriceForProduct(productId: string) {
  const product = getProductById(productId);

  if (!product) {
    return undefined;
  }

  const latestComputation = getPriceHistoryByProductId(productId)[0];

  if (latestComputation) {
    return latestComputation;
  }

  const result = await calculateDynamicPrice(normalizeProductToInput(product));
  return getPriceHistoryByProductId(productId)[0] ?? result;
}

export async function recalculateDynamicPrice(
  productId: string,
  overrides?: Partial<PriceComputationInput>,
) {
  const product = getProductById(productId);

  if (!product) {
    return undefined;
  }

  const updatedProduct = updateProductSnapshot(productId, overrides ?? {});

  if (!updatedProduct) {
    return undefined;
  }

  return calculateDynamicPrice(normalizeProductToInput(updatedProduct));
}
