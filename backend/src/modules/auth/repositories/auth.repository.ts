import { Injectable } from '@nestjs/common';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class AuthRepository {
  async createSession(userId: string): Promise<SessionEntity> {
    return new SessionEntity(`token-for-${userId}`, '3600s');
  }
}
