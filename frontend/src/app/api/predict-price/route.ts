import { NextRequest, NextResponse } from "next/server";

import {
  MlServiceError,
  PredictPriceRequest,
  predictPrice,
} from "@/lib/ml-service";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as PredictPriceRequest;

  try {
    const prediction = await predictPrice(payload);
    return NextResponse.json(prediction, { status: 200 });
  } catch (error) {
    const message =
      error instanceof MlServiceError
        ? error.message
        : "Unexpected error while calling ML service.";

    return NextResponse.json(
      {
        error: message,
        retryable: true,
      },
      { status: 503 },
    );
  }
}
