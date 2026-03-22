import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingRepository {
  async getBasePrice(productId: string): Promise<number> {
    return productId === 'prd_1' ? 49 : 99;
  }
}
