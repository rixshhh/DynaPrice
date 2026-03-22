export type PredictPriceRequest = {
  product_id: string;
  base_price: number;
  demand_score: number;
  competitor_price: number;
  historical: {
    recent_prices: number[];
    recent_demands: number[];
    seasonal_indexes: number[];
  };
};

export type PredictPriceResponse = {
  predicted_price: number;
  metadata: {
    confidence: number;
    feature_snapshot: Record<string, number | number[]>;
    notes: string[];
  };
  model_version: string;
};

const DEFAULT_TIMEOUT_MS = 4_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_BASE_URL = process.env.ML_SERVICE_URL ?? "http://127.0.0.1:8001";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MlServiceError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "MlServiceError";
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new MlServiceError(`ML service request timed out after ${timeoutMs}ms`, error);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function predictPrice(
  payload: PredictPriceRequest,
  options?: { timeoutMs?: number; retries?: number; baseUrl?: string },
): Promise<PredictPriceResponse> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options?.retries ?? DEFAULT_RETRIES;
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}/predict-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, timeoutMs);

      if (!response.ok) {
        const text = await response.text();
        throw new MlServiceError(`ML service responded with ${response.status}: ${text}`);
      }

      return (await response.json()) as PredictPriceResponse;
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      await sleep(200 * (attempt + 1));
    }
  }

  throw new MlServiceError("Unable to retrieve price prediction from ML service", lastError);
}
