import { redisConfig } from "./env";

type RedisScalar = string | number;

const sanitize = (value: unknown) => {
  if (value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value as RedisScalar;
};

const command = async <T>(...args: RedisScalar[]) => {
  if (!redisConfig.restUrl || !redisConfig.restToken) {
    throw new Error("Missing REDIS_REST_URL or REDIS_REST_TOKEN environment variable.");
  }

  const response = await fetch(`${redisConfig.restUrl}/${args.map((arg) => encodeURIComponent(String(arg))).join("/")}`, {
    headers: {
      Authorization: `Bearer ${redisConfig.restToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis command failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { result: T; error?: string };

  if (payload.error) {
    throw new Error(payload.error);
  }

  return sanitize(payload.result) as T;
};

export const redis = {
  get: (key: string) => command<string | null>("GET", key),
  set: (key: string, value: string, mode: "EX", ttlSeconds: number) =>
    command<string>("SET", key, value, mode, ttlSeconds),
  sadd: (key: string, ...members: string[]) => command<number>("SADD", key, ...members),
  smembers: (key: string) => command<string[]>("SMEMBERS", key),
  del: (...keys: string[]) => command<number>("DEL", ...keys),
  incr: (key: string) => command<number>("INCR", key),
  expire: (key: string, ttlSeconds: number) => command<number>("EXPIRE", key, ttlSeconds),
};
