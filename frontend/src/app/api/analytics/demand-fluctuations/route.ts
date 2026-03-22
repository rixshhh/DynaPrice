import { NextRequest, NextResponse } from "next/server";

import { getAnalyticsContext, getDemandFluctuations } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const context = getAnalyticsContext(request);

  return NextResponse.json({
    data: getDemandFluctuations(context.range),
    filters: context.appliedFilters,
  });
}
