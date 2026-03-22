"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomPatterns = void 0;
exports.allRoomsForPriceChange = allRoomsForPriceChange;
exports.roomPatterns = {
    seller: (sellerId) => `seller:${sellerId}`,
    category: (categoryId) => `category:${categoryId}`,
    product: (productId) => `product:${productId}`,
};
function allRoomsForPriceChange(input) {
    return [
        exports.roomPatterns.seller(input.sellerId),
        exports.roomPatterns.category(input.categoryId),
        exports.roomPatterns.product(input.productId),
    ];
}
//# sourceMappingURL=room-patterns.js.map