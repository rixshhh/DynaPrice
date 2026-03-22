import { Module } from '@nestjs/common';
import { RealtimeService } from './services/realtime.service';
import { RealtimeRepository } from './repositories/realtime.repository';
import { WebsocketAdapter } from './adapters/websocket.adapter';
import { RealtimeGateway } from './gateways/realtime.gateway';

@Module({
  providers: [RealtimeService, RealtimeRepository, WebsocketAdapter, RealtimeGateway],
  exports: [RealtimeService],
})
export class RealtimeModule {}
