import { NextResponse } from "next/server";

import { enforceRateLimit, resolveClientIdentifier, type RateLimitPolicy } from "./rate-limit";

export const applyRateLimit = async (request: Request, policies: RateLimitPolicy[]) => {
  const identifier = resolveClientIdentifier(request);

  for (const policy of policies) {
    const result = await enforceRateLimit(policy, identifier);

    if (!result.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded for ${policy} policy.` },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.resetSeconds),
          },
        },
      );
    }
  }

  return null;
};
