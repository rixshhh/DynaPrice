import { Module } from '@nestjs/common';
import { PricingController } from './controllers/pricing.controller';
import { PricingService } from './services/pricing.service';
import { PricingRepository } from './repositories/pricing.repository';
import { RuleEngineAdapter } from './adapters/rule-engine.adapter';

@Module({
  controllers: [PricingController],
  providers: [PricingService, PricingRepository, RuleEngineAdapter],
  exports: [PricingService],
})
export class PricingModule {}
