import { Injectable } from '@nestjs/common';
import { TrackEventDto } from '../dto/track-event.dto';
import { AnalyticsEventEntity } from '../entities/analytics-event.entity';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { EventBusAdapter } from '../adapters/event-bus.adapter';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly eventBusAdapter: EventBusAdapter,
  ) {}

  async track(payload: TrackEventDto): Promise<AnalyticsEventEntity> {
    const event = new AnalyticsEventEntity(payload.eventName, payload.properties);
    this.eventBusAdapter.publish(event);
    return this.analyticsRepository.save(event);
  }
}
