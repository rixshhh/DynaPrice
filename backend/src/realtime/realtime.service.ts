import { Injectable } from '@nestjs/common';

import { PriceChangeEvent } from './interfaces/price-change-event.interface';
import { allRoomsForPriceChange } from './room-patterns';
import { PriceGateway } from './price.gateway';

@Injectable()
export class RealtimeService {
  constructor(private readonly priceGateway: PriceGateway) {}

  publishPriceChanged(event: PriceChangeEvent) {
    const rooms = allRoomsForPriceChange(event);
    this.priceGateway.broadcastPriceChanged(event, rooms);
  }
}
