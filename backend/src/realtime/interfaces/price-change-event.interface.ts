export type PriceChangeSource = 'formula' | 'ml';

export interface PriceChangeEvent {
  productId: string;
  sellerId: string;
  categoryId: string;
  oldPrice: number;
  newPrice: number;
  changedAt: string;
  source: PriceChangeSource;
}
