import { NextResponse } from "next/server";

import { recalculateDynamicPrice } from "@/pricing/service";
import { BusinessConstraints } from "@/pricing/types";

type RecalculatePayload = {
  demandScore?: number;
  competitorPricing?: number[];
  historicalData?: number[];
  baseCost?: number;
  currentPrice?: number;
  constraints?: BusinessConstraints;
};

export async function POST(
  request: Request,
  { params }: { params: { productId: string } },
) {
  const payload = (await request.json().catch(() => ({}))) as RecalculatePayload;

  const result = await recalculateDynamicPrice(params.productId, payload);

  if (!result) {
    return NextResponse.json(
      { error: `Product '${params.productId}' was not found.` },
      { status: 404 },
    );
  }

  return NextResponse.json(result, { status: 201 });
}
