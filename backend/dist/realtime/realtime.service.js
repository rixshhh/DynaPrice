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
exports.RealtimeService = void 0;
const common_1 = require("@nestjs/common");
const room_patterns_1 = require("./room-patterns");
const price_gateway_1 = require("./price.gateway");
let RealtimeService = class RealtimeService {
    constructor(priceGateway) {
        this.priceGateway = priceGateway;
    }
    publishPriceChanged(event) {
        const rooms = (0, room_patterns_1.allRoomsForPriceChange)(event);
        this.priceGateway.broadcastPriceChanged(event, rooms);
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [price_gateway_1.PriceGateway])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map