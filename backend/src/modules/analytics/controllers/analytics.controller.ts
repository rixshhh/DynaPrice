import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { TrackEventDto } from '../dto/track-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  track(@Body() payload: TrackEventDto) {
    return this.analyticsService.track(payload);
  }
}
