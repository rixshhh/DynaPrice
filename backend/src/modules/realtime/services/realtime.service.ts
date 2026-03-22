import { Injectable } from '@nestjs/common';
import { PublishUpdateDto } from '../dto/publish-update.dto';
import { RealtimeMessageEntity } from '../entities/realtime-message.entity';
import { RealtimeRepository } from '../repositories/realtime.repository';
import { WebsocketAdapter } from '../adapters/websocket.adapter';

@Injectable()
export class RealtimeService {
  constructor(
    private readonly realtimeRepository: RealtimeRepository,
    private readonly websocketAdapter: WebsocketAdapter,
  ) {}

  async publish(payload: PublishUpdateDto): Promise<RealtimeMessageEntity> {
    const message = new RealtimeMessageEntity(payload.channel, payload.payload);
    this.websocketAdapter.broadcast(message);
    return this.realtimeRepository.save(message);
  }
}
