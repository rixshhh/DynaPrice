import { NextRequest, NextResponse } from "next/server";

import {
  buildPricingCacheKey,
  getCachedJson,
  pricingCacheTtlSeconds,
  setCachedJson,
} from "@/lib/cache";
import { calculateDynamicPrice, type PricingInput } from "@/lib/pricing";
import { applyRateLimit } from "@/lib/api-guard";

export async function POST(request: NextRequest) {
  const rateLimited = await applyRateLimit(request, ["global", "pricing"]);

  if (rateLimited) {
    return rateLimited;
  }

  const payload = (await request.json()) as PricingInput;

  if (!payload.productId || payload.competitorPrice == null || payload.demandScore == null) {
    return NextResponse.json(
      { error: "productId, competitorPrice, and demandScore are required." },
      { status: 400 },
    );
  }

  const featureSnapshot = {
    basePrice: payload.basePrice ?? 100,
    competitorPrice: payload.competitorPrice,
    demandScore: payload.demandScore,
    inventoryLevel: payload.inventoryLevel ?? 50,
    customerSegment: payload.customerSegment ?? "all",
    channel: payload.channel ?? "default",
  };

  const cacheKey = buildPricingCacheKey(payload.productId, featureSnapshot);
  const cached = await getCachedJson<{ price: number; cachedAt: string }>(cacheKey);

  if (cached) {
    return NextResponse.json({ ...cached, cache: "hit", cacheKey });
  }

  const response = {
    price: calculateDynamicPrice(payload),
    cachedAt: new Date().toISOString(),
    inputs: featureSnapshot,
  };

  await setCachedJson(cacheKey, response, pricingCacheTtlSeconds, payload.productId);

  return NextResponse.json({ ...response, cache: "miss", cacheKey });
}
