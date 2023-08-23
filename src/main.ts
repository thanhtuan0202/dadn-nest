import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import realtimeupdate from "./helpers/realtimeupdate";
dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule,{cors: true});
  app.enableCors();

  await app.listen(5000);
  realtimeupdate();
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
