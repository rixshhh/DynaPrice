declare module '@nestjs/common' {
  export const Injectable: () => ClassDecorator;
  export const Module: (metadata: any) => ClassDecorator;
  export class Logger {
    constructor(context?: string);
    debug(message: string): void;
  }
}

declare module '@nestjs/core' {
  export const NestFactory: {
    create(module: any): Promise<{ enableCors(): void; listen(port: number): Promise<void> }>;
  };
}

declare module '@nestjs/websockets' {
  export const ConnectedSocket: () => ParameterDecorator;
  export const MessageBody: () => ParameterDecorator;
  export interface OnGatewayConnection {
    handleConnection?(client: any): void;
  }
  export interface OnGatewayDisconnect {
    handleDisconnect?(client: any): void;
  }
  export const SubscribeMessage: (event: string) => MethodDecorator;
  export const WebSocketGateway: (metadata?: any) => ClassDecorator;
  export const WebSocketServer: () => PropertyDecorator;
}

declare module 'socket.io' {
  export class Socket {
    id: string;
    join(room: string): Promise<void>;
    leave(room: string): Promise<void>;
  }

  export class Server {
    to(room: string): { emit(event: string, payload: unknown): void };
  }
}

declare module 'reflect-metadata';
