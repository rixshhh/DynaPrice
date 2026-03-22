import { Injectable } from '@nestjs/common';
import { AnalyticsEventEntity } from '../entities/analytics-event.entity';

@Injectable()
export class AnalyticsRepository {
  async save(event: AnalyticsEventEntity): Promise<AnalyticsEventEntity> {
    return event;
  }
}
