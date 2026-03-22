import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

import { requestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const headerValue = request.header('x-correlation-id');
    const correlationId = headerValue?.trim() || randomUUID();

    response.setHeader('x-correlation-id', correlationId);

    requestContext.run({ correlationId }, () => {
      next();
    });
  }
}
