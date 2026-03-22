import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('app.port', 3001);
  }

  get apiPrefix(): string {
    return this.configService.get<string>('app.apiPrefix', 'api');
  }

  get corsOrigin(): string {
    return this.configService.get<string>('app.corsOrigin', 'http://localhost:3000');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('auth.jwtSecret', 'change-me');
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('auth.jwtExpiration', '3600s');
  }
}
