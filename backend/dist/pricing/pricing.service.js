"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const realtime_service_1 = require("../realtime/realtime.service");
let PricingService = class PricingService {
    constructor(realtimeService) {
        this.realtimeService = realtimeService;
    }
    handleComputedPrice(input) {
        if (input.currentComputedPrice === input.nextComputedPrice) {
            return null;
        }
        const event = {
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
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map