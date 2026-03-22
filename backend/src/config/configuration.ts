export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3001),
    apiPrefix: process.env.API_PREFIX ?? 'api',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me',
    jwtExpiration: process.env.JWT_EXPIRATION ?? '3600s',
  },
  pricing: {
    provider: process.env.PRICING_PROVIDER ?? 'rule-engine',
  },
  analytics: {
    provider: process.env.ANALYTICS_PROVIDER ?? 'event-bus',
  },
  realtime: {
    transport: process.env.REALTIME_TRANSPORT ?? 'websocket',
  },
});
