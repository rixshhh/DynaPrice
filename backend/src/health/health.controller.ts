import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: this.configService.get<string>('SERVICE_NAME', 'dynaprice-api'),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  getReadiness() {
    return {
      status: 'ready',
      dependencies: {
        postgres: 'configured',
        redis: 'configured',
        mlServiceUrl: this.configService.get<string>('ML_SERVICE_URL'),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
