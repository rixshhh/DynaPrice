import { rateLimitConfig } from "./env";
import { redis } from "./redis";

export type RateLimitPolicy = keyof typeof rateLimitConfig;


export const resolveClientIdentifier = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
};

export const enforceRateLimit = async (policy: RateLimitPolicy, identifier: string) => {
  const { limit, windowMs } = rateLimitConfig[policy];
  const key = `ratelimit:${policy}:${identifier}:${Math.floor(Date.now() / windowMs)}`;
  const ttlSeconds = Math.ceil(windowMs / 1000);
  const requestCount = await redis.incr(key);

  if (requestCount === 1) {
    await redis.expire(key, ttlSeconds);
  }

  const remaining = Math.max(limit - requestCount, 0);

  return {
    allowed: requestCount <= limit,
    limit,
    remaining,
    resetSeconds: ttlSeconds,
  };
};
