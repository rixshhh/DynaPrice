import crypto from "crypto";

import { cacheConfig } from "./env";
import { redis } from "./redis";

const stableStringify = (value: unknown) => JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());

const digestFeatures = (features: Record<string, unknown>) =>
  crypto.createHash("sha256").update(stableStringify(features)).digest("hex").slice(0, 16);

const productSetKey = (productId: string) => `product:${productId}:cache-keys`;

export const buildPricingCacheKey = (productId: string, features: Record<string, unknown>) =>
  `pricing:${productId}:${digestFeatures(features)}`;

export const buildAnalyticsCacheKey = (productId: string, filters: Record<string, unknown>) =>
  `analytics:${productId}:${digestFeatures(filters)}`;

export const getCachedJson = async <T>(key: string) => {
  const cached = await redis.get(key);
  return cached ? (JSON.parse(cached) as T) : null;
};

export const setCachedJson = async (
  key: string,
  value: unknown,
  ttlSeconds: number,
  productId: string,
) => {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  await redis.sadd(productSetKey(productId), key);
};

export const invalidateProductCache = async (productId: string) => {
  const dependencyKey = productSetKey(productId);
  const keys = await redis.smembers(dependencyKey);

  if (keys.length === 0) {
    return { invalidatedKeys: 0 };
  }

  await redis.del(...keys, dependencyKey);

  return { invalidatedKeys: keys.length };
};

export const pricingCacheTtlSeconds = cacheConfig.pricingTtlSeconds;
export const analyticsCacheTtlSeconds = cacheConfig.analyticsTtlSeconds;
