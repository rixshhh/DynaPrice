import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  correlationId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextStore>();
