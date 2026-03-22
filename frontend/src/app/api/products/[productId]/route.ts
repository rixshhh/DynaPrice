import { NextRequest, NextResponse } from "next/server";

import { buildPricingCacheKey, invalidateProductCache, pricingCacheTtlSeconds, setCachedJson } from "@/lib/cache";
import { calculateDynamicPrice, type PricingInput } from "@/lib/pricing";
import { applyRateLimit } from "@/lib/api-guard";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const rateLimited = await applyRateLimit(request, ["global"]);

  if (rateLimited) {
    return rateLimited;
  }

  const body = (await request.json()) as Partial<PricingInput> & { refreshPricing?: boolean };
  const { productId } = params;

  const invalidation = await invalidateProductCache(productId);

  const refreshPayload =
    body.refreshPricing && body.competitorPrice != null && body.demandScore != null
      ? {
          productId,
          competitorPrice: body.competitorPrice,
          demandScore: body.demandScore,
          basePrice: body.basePrice,
          inventoryLevel: body.inventoryLevel,
          customerSegment: body.customerSegment,
          channel: body.channel,
        }
      : null;

  const refreshedPrice = refreshPayload ? calculateDynamicPrice(refreshPayload) : null;

  if (refreshPayload && refreshedPrice != null) {
    const cacheKey = buildPricingCacheKey(productId, {
      basePrice: refreshPayload.basePrice ?? 100,
      competitorPrice: refreshPayload.competitorPrice,
      demandScore: refreshPayload.demandScore,
      inventoryLevel: refreshPayload.inventoryLevel ?? 50,
      customerSegment: refreshPayload.customerSegment ?? "all",
      channel: refreshPayload.channel ?? "default",
    });

    await setCachedJson(
      cacheKey,
      {
        price: refreshedPrice,
        cachedAt: new Date().toISOString(),
        inputs: refreshPayload,
      },
      pricingCacheTtlSeconds,
      productId,
    );
  }

  return NextResponse.json({
    productId,
    invalidation,
    refreshedPrice,
    message:
      "Product-related cache entries were invalidated. Use refreshPricing=true with updated demand or competitor inputs to prime a new price.",
  });
}
