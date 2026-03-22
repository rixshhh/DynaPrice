import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(payload: LoginDto): Promise<SessionEntity> {
    return this.authRepository.createSession(payload.email);
  }
}
