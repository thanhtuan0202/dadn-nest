import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

import { DataModule } from './data/data.module';
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DataModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
