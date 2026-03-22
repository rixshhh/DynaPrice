import { Body, Controller, Post } from '@nestjs/common';
import { PublishUpdateDto } from '../dto/publish-update.dto';
import { RealtimeService } from '../services/realtime.service';

@Controller('realtime')
export class RealtimeGateway {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Post('publish')
  publish(@Body() payload: PublishUpdateDto) {
    return this.realtimeService.publish(payload);
  }
}
