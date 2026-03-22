export class PricePreviewEntity {
  constructor(
    public readonly productId: string,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
  ) {}
}
