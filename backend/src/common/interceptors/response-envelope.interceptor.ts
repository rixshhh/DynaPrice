import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, { success: boolean; data: T }> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<{ success: boolean; data: T }> {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}
