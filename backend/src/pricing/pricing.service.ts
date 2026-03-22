import { Injectable } from '@nestjs/common';

import {
  PriceChangeEvent,
  PriceChangeSource,
} from '../realtime/interfaces/price-change-event.interface';
import { RealtimeService } from '../realtime/realtime.service';

interface ProductPricingInput {
  productId: string;
  sellerId: string;
  categoryId: string;
  currentComputedPrice: number;
  nextComputedPrice: number;
  source: PriceChangeSource;
}

@Injectable()
export class PricingService {
  constructor(private readonly realtimeService: RealtimeService) {}

  handleComputedPrice(input: ProductPricingInput): PriceChangeEvent | null {
    if (input.currentComputedPrice === input.nextComputedPrice) {
      return null;
    }

    const event: PriceChangeEvent = {
      productId: input.productId,
      sellerId: input.sellerId,
      categoryId: input.categoryId,
      oldPrice: input.currentComputedPrice,
      newPrice: input.nextComputedPrice,
      changedAt: new Date().toISOString(),
      source: input.source,
    };

    this.realtimeService.publishPriceChanged(event);

    return event;
  }
}
