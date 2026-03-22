export const roomPatterns = {
  seller: (sellerId: string) => `seller:${sellerId}`,
  category: (categoryId: string) => `category:${categoryId}`,
  product: (productId: string) => `product:${productId}`,
} as const;

export function allRoomsForPriceChange(input: {
  sellerId: string;
  categoryId: string;
  productId: string;
}): string[] {
  return [
    roomPatterns.seller(input.sellerId),
    roomPatterns.category(input.categoryId),
    roomPatterns.product(input.productId),
  ];
}
