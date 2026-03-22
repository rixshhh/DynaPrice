import { Injectable, Logger } from '@nestjs/common';
import { RealtimeMessageEntity } from '../entities/realtime-message.entity';

@Injectable()
export class WebsocketAdapter {
  private readonly logger = new Logger(WebsocketAdapter.name);

  broadcast(message: RealtimeMessageEntity): void {
    this.logger.log(`Broadcasting realtime update on ${message.channel}`);
  }
}
