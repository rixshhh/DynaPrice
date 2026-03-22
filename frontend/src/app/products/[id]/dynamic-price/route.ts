import { NextResponse } from "next/server";

import { getDynamicPriceForProduct } from "@/pricing/service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const price = await getDynamicPriceForProduct(params.id);

  if (!price) {
    return NextResponse.json(
      { error: `Product '${params.id}' was not found.` },
      { status: 404 },
    );
  }

  return NextResponse.json(price);
}
