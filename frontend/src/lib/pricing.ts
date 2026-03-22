export type PricingInput = {
  productId: string;
  basePrice?: number;
  competitorPrice: number;
  demandScore: number;
  inventoryLevel?: number;
  customerSegment?: string;
  channel?: string;
};

export const calculateDynamicPrice = ({
  basePrice = 100,
  competitorPrice,
  demandScore,
  inventoryLevel = 50,
}: PricingInput) => {
  const demandMultiplier = 1 + demandScore / 200;
  const inventoryAdjustment = inventoryLevel < 20 ? 1.08 : inventoryLevel > 100 ? 0.96 : 1;
  const competitorAnchor = competitorPrice * 0.55 + basePrice * 0.45;
  const rawPrice = competitorAnchor * demandMultiplier * inventoryAdjustment;

  return Number(rawPrice.toFixed(2));
};
