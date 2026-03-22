import { Body, Controller, Post } from '@nestjs/common';
import { PricePreviewDto } from '../dto/price-preview.dto';
import { PricingService } from '../services/pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('preview')
  preview(@Body() payload: PricePreviewDto) {
    return this.pricingService.previewPrice(payload);
  }
}
