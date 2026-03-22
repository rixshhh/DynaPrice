This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Redis-backed API caching and throttling

This project now includes example App Router API endpoints that use Redis REST for caching and rate limiting:

- `POST /api/pricing` caches dynamic pricing responses using keys derived from the `productId` plus relevant pricing inputs such as `competitorPrice`, `demandScore`, inventory, segment, and channel.
- `GET /api/analytics/high-read` caches high-read analytics queries by `productId` plus request filters.
- `PATCH /api/products/[productId]` invalidates all cached entries for a product and can optionally refresh the latest price when `refreshPricing=true` and updated pricing inputs are supplied.
- `POST /api/auth/login` applies the stricter auth throttling profile.

### Environment variables

Copy `.env.example` and set the Redis REST credentials along with cache/rate-limit settings:

```bash
REDIS_REST_URL=
REDIS_REST_TOKEN=
CACHE_PRICING_TTL_SECONDS=60
CACHE_ANALYTICS_TTL_SECONDS=300
RATE_LIMIT_GLOBAL_MAX=120
RATE_LIMIT_GLOBAL_WINDOW_MS=60000
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_AUTH_WINDOW_MS=60000
RATE_LIMIT_PRICING_MAX=30
RATE_LIMIT_PRICING_WINDOW_MS=60000
```

### Example requests

```bash
curl -X POST http://localhost:3000/api/pricing \
  -H 'Content-Type: application/json' \
  -d '{"productId":"sku-123","competitorPrice":119.99,"demandScore":72,"inventoryLevel":18}'

curl 'http://localhost:3000/api/analytics/high-read?productId=sku-123&range=7d&metric=revenue'

curl -X PATCH http://localhost:3000/api/products/sku-123 \
  -H 'Content-Type: application/json' \
  -d '{"competitorPrice":124.5,"demandScore":80,"refreshPricing":true}'
```
