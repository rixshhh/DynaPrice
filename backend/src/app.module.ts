import { Module } from '@nestjs/common';

import { PricingModule } from './pricing/pricing.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [RealtimeModule, PricingModule],
})
export class AppModule {}
