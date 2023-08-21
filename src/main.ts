import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import realtimeupdate from "./helpers/realtimeupdate";
import { createServer } from "http";
dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule,{cors: true});
  app.enableCors();
  const httpserver = createServer()
  const io = new Server(httpserver, {
    cors: {
      origin: true
    }
  })
  await app.listen(5000);
  realtimeupdate(io);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
