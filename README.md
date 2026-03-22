# DynaPrice deployment guide

DynaPrice now includes a production-oriented NestJS API, a FastAPI ML service, and local container orchestration for PostgreSQL and Redis.

## Services

- `frontend/`: Next.js marketing frontend.
- `backend/`: NestJS API with Helmet, explicit CORS allow-listing, global validation, centralized exception handling, structured Pino logging, and request correlation IDs.
- `ml-service/`: FastAPI inference service with health endpoints.
- `docker-compose.yml`: Local deployment stack for the API, ML service, PostgreSQL, and Redis.

## Startup flow

1. Copy `.env.example` to `.env` in the repository root and adjust the values for your environment.
2. Start infrastructure with Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Docker Compose starts PostgreSQL and Redis first.
4. The ML service boots next and reports healthy on `http://localhost:8000/health`.
5. The API waits for PostgreSQL, Redis, and the ML service, then starts on `http://localhost:4000/api`.
6. The frontend can run separately from `frontend/` and should use one of the origins declared in `CORS_ORIGINS`.

## Required environment variables

### Shared / deployment

- `NODE_ENV`: runtime environment (`development`, `test`, or `production`).

### API

- `SERVICE_NAME`: name attached to structured logs.
- `PORT`: port exposed by the NestJS API container.
- `LOG_LEVEL`: Pino log level (`info`, `debug`, etc.).
- `CORS_ORIGINS`: comma-separated list of allowed browser origins, for example `http://localhost:3000,http://localhost:3001`.
- `DATABASE_URL`: PostgreSQL connection string used by the API.
- `REDIS_URL`: Redis connection string used by the API.
- `ML_SERVICE_URL`: base URL for the ML service.

### PostgreSQL

- `POSTGRES_DB`: default database name.
- `POSTGRES_USER`: database user.
- `POSTGRES_PASSWORD`: database password.

### Redis

- `REDIS_PORT`: optional documentation value for Redis port mapping.

## Health-check endpoints

### API

- `GET /api/health`: liveness probe.
- `GET /api/health/ready`: readiness probe with dependency configuration summary.

### ML service

- `GET /health`: liveness probe.
- `GET /health/ready`: readiness probe.

## Middleware and infrastructure included

### API protections and request handling

- **Helmet** secures common HTTP headers.
- **CORS** uses an explicit allow-list from `CORS_ORIGINS`.
- **Global validation** strips unknown fields, transforms payloads, and rejects non-whitelisted input.
- **Centralized exception filter** formats API errors consistently and logs failures.
- **Structured logging** uses `nestjs-pino` / Pino with JSON logs in production.
- **Correlation IDs** are accepted from `x-correlation-id` or generated automatically, then echoed in logs and responses.

## Local development tips

- API only:
  ```bash
  cd backend
  npm install
  npm run start:dev
  ```
- ML service only:
  ```bash
  cd ml-service
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```
