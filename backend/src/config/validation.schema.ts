import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3001),
  API_PREFIX: Joi.string().default('api'),
  CORS_ORIGIN: Joi.string().uri({ allowRelative: false }).default('http://localhost:3000'),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRATION: Joi.string().default('3600s'),
  PRICING_PROVIDER: Joi.string().default('rule-engine'),
  ANALYTICS_PROVIDER: Joi.string().default('event-bus'),
  REALTIME_TRANSPORT: Joi.string().default('websocket'),
});
