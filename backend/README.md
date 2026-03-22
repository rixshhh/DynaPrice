# DynaPrice Backend

A NestJS + TypeScript service scaffolded for modular domain development.

## Modules

- `auth`: login/session entrypoints, guards, and strategy placeholders.
- `users`: user listing and user-oriented repository/service patterns.
- `products`: product catalog controller/service/repository layers.
- `pricing`: dynamic price preview workflows with infrastructure adapters.
- `analytics`: event tracking pipelines with adapter boundaries.
- `realtime`: publish-style realtime updates with transport adapters.

## Structure

```text
src/
  common/      # cross-cutting guards, filters, interceptors, interfaces
  config/      # environment configuration + validation
  modules/     # bounded contexts with controllers/services/repositories/etc.
```

## Scripts

- `npm run dev`: watch mode server for local development.
- `npm run build`: production build to `dist/`.
- `npm run start`: run the compiled service.
- `npm run lint`: lint TypeScript sources.
- `npm run test`: run Jest tests.
