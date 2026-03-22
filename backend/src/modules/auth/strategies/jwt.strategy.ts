import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@config/app-config.service';

@Injectable()
export class JwtStrategy {
  constructor(private readonly appConfigService: AppConfigService) {}

  get secret(): string {
    return this.appConfigService.jwtSecret;
  }
}
