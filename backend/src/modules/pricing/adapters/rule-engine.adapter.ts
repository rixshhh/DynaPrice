import { Injectable } from '@nestjs/common';

@Injectable()
export class RuleEngineAdapter {
  calculate(basePrice: number, quantity: number): number {
    return quantity >= 10 ? Math.round(basePrice * 0.9 * 100) / 100 : basePrice;
  }
}
