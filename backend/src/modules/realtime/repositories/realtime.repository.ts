import { Injectable } from '@nestjs/common';
import { RealtimeMessageEntity } from '../entities/realtime-message.entity';

@Injectable()
export class RealtimeRepository {
  async save(message: RealtimeMessageEntity): Promise<RealtimeMessageEntity> {
    return message;
  }
}
