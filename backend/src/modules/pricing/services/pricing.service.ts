import { Injectable } from '@nestjs/common';
import { PricePreviewDto } from '../dto/price-preview.dto';
import { PricePreviewEntity } from '../entities/price-preview.entity';
import { RuleEngineAdapter } from '../adapters/rule-engine.adapter';
import { PricingRepository } from '../repositories/pricing.repository';

@Injectable()
export class PricingService {
  constructor(
    private readonly pricingRepository: PricingRepository,
    private readonly ruleEngineAdapter: RuleEngineAdapter,
  ) {}

  async previewPrice(payload: PricePreviewDto): Promise<PricePreviewEntity> {
    const basePrice = await this.pricingRepository.getBasePrice(payload.productId);
    const unitPrice = this.ruleEngineAdapter.calculate(basePrice, payload.quantity);
    return new PricePreviewEntity(payload.productId, unitPrice, unitPrice * payload.quantity);
  }
}
