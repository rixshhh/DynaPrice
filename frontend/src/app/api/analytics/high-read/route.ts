import { NextRequest, NextResponse } from "next/server";

import {
  analyticsCacheTtlSeconds,
  buildAnalyticsCacheKey,
  getCachedJson,
  setCachedJson,
} from "@/lib/cache";
import { applyRateLimit } from "@/lib/api-guard";

export async function GET(request: NextRequest) {
  const rateLimited = await applyRateLimit(request, ["global"]);

  if (rateLimited) {
    return rateLimited;
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const range = searchParams.get("range") ?? "24h";
  const metric = searchParams.get("metric") ?? "conversion";

  if (!productId) {
    return NextResponse.json({ error: "productId is required." }, { status: 400 });
  }

  const filters = { range, metric };
  const cacheKey = buildAnalyticsCacheKey(productId, filters);
  const cached = await getCachedJson<unknown>(cacheKey);

  if (cached) {
    return NextResponse.json({ data: cached, cache: "hit", cacheKey });
  }

  const data = {
    productId,
    range,
    metric,
    generatedAt: new Date().toISOString(),
    summary: {
      views: 12420,
      conversions: 641,
      revenueLiftPct: 12.4,
    },
  };

  await setCachedJson(cacheKey, data, analyticsCacheTtlSeconds, productId);

  return NextResponse.json({ data, cache: "miss", cacheKey });
}
