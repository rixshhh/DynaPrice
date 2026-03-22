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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PriceGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const subscribe_room_dto_1 = require("./dto/subscribe-room.dto");
const room_patterns_1 = require("./room-patterns");
let PriceGateway = PriceGateway_1 = class PriceGateway {
    constructor() {
        this.logger = new common_1.Logger(PriceGateway_1.name);
    }
    handleConnection(client) {
        this.logger.debug(`client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.debug(`client disconnected: ${client.id}`);
    }
    handleSubscribe(client, body) {
        const room = room_patterns_1.roomPatterns[body.scope](body.value);
        void client.join(room);
        return {
            event: 'subscribed',
            data: {
                room,
            },
        };
    }
    handleUnsubscribe(client, body) {
        const room = room_patterns_1.roomPatterns[body.scope](body.value);
        void client.leave(room);
        return {
            event: 'unsubscribed',
            data: {
                room,
            },
        };
    }
    broadcastPriceChanged(event, rooms) {
        rooms.forEach((room) => {
            this.server.to(room).emit('price.changed', event);
        });
    }
};
exports.PriceGateway = PriceGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PriceGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        subscribe_room_dto_1.SubscribeRoomDto]),
    __metadata("design:returntype", void 0)
], PriceGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        subscribe_room_dto_1.SubscribeRoomDto]),
    __metadata("design:returntype", void 0)
], PriceGateway.prototype, "handleUnsubscribe", null);
exports.PriceGateway = PriceGateway = PriceGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/realtime',
        cors: {
            origin: '*',
        },
    })
], PriceGateway);
//# sourceMappingURL=price.gateway.js.map