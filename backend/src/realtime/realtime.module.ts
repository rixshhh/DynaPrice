import { Module } from '@nestjs/common';

import { PriceGateway } from './price.gateway';
import { RealtimeService } from './realtime.service';

@Module({
  providers: [PriceGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
