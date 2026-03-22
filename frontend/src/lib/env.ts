const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requireValue = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const redisConfig = {
  restUrl: process.env.REDIS_REST_URL,
  restToken: process.env.REDIS_REST_TOKEN,
};

export const cacheConfig = {
  pricingTtlSeconds: toNumber(process.env.CACHE_PRICING_TTL_SECONDS, 60),
  analyticsTtlSeconds: toNumber(process.env.CACHE_ANALYTICS_TTL_SECONDS, 300),
};

export const rateLimitConfig = {
  global: {
    limit: toNumber(process.env.RATE_LIMIT_GLOBAL_MAX, 120),
    windowMs: toNumber(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS, 60_000),
  },
  auth: {
    limit: toNumber(process.env.RATE_LIMIT_AUTH_MAX, 10),
    windowMs: toNumber(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 60_000),
  },
  pricing: {
    limit: toNumber(process.env.RATE_LIMIT_PRICING_MAX, 30),
    windowMs: toNumber(process.env.RATE_LIMIT_PRICING_WINDOW_MS, 60_000),
  },
};

export const ensureRedisConnection = () => {
  requireValue(redisConfig.restUrl, "REDIS_REST_URL");
  requireValue(redisConfig.restToken, "REDIS_REST_TOKEN");
};
