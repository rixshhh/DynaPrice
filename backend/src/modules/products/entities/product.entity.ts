export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly basePrice: number,
  ) {}
}
