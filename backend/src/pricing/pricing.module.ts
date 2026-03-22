import { Module } from '@nestjs/common';

import { RealtimeModule } from '../realtime/realtime.module';
import { PricingService } from './pricing.service';

@Module({
  imports: [RealtimeModule],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
