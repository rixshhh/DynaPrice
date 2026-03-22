import { NextRequest, NextResponse } from "next/server";

import { getAnalyticsContext, getPriceTrends } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const context = getAnalyticsContext(request);

  return NextResponse.json({
    data: getPriceTrends(context.range),
    filters: context.appliedFilters,
  });
}
