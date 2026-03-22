import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsEventEntity } from '../entities/analytics-event.entity';

@Injectable()
export class EventBusAdapter {
  private readonly logger = new Logger(EventBusAdapter.name);

  publish(event: AnalyticsEventEntity): void {
    this.logger.log(`Published analytics event: ${event.eventName}`);
  }
}
