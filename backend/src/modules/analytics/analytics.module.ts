import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { EventBusAdapter } from './adapters/event-bus.adapter';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository, EventBusAdapter],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
