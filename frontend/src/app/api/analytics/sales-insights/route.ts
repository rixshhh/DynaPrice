import { NextRequest, NextResponse } from "next/server";

import { getAnalyticsContext, getSalesInsights } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const context = getAnalyticsContext(request);

  return NextResponse.json({
    data: getSalesInsights(context.range),
    filters: context.appliedFilters,
  });
}
