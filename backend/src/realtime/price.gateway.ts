import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { SubscribeRoomDto } from './dto/subscribe-room.dto';
import { PriceChangeEvent } from './interfaces/price-change-event.interface';
import { roomPatterns } from './room-patterns';

@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: '*',
  },
})
export class PriceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(PriceGateway.name);

  handleConnection(client: Socket) {
    this.logger.debug(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SubscribeRoomDto,
  ) {
    const room = roomPatterns[body.scope](body.value);
    void client.join(room);

    return {
      event: 'subscribed',
      data: {
        room,
      },
    };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SubscribeRoomDto,
  ) {
    const room = roomPatterns[body.scope](body.value);
    void client.leave(room);

    return {
      event: 'unsubscribed',
      data: {
        room,
      },
    };
  }

  broadcastPriceChanged(event: PriceChangeEvent, rooms: string[]) {
    rooms.forEach((room) => {
      this.server.to(room).emit('price.changed', event);
    });
  }
}
