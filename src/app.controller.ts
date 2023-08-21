import { Controller, Get, Inject, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './socket/app.gateway';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(AppGateway) private readonly appGateway: AppGateway,
  ) {}
  @Post()
  sendMessage(@Body() body: { emit: string; data: any }) {
    if (body.emit === 'temperature') {
      this.appGateway.server.emit('temperatureUpdate', {
        temperature: body.data,
      });
    } else if (body.emit === 'fan') {
      this.appGateway.server.emit('fanUpdate', { fan: body.data });
    } else if (body.emit === 'led') {
      this.appGateway.server.emit('lightUpdate', { light: body.data });
    } else if (body.emit === 'humidity') {
      this.appGateway.server.emit('humidityUpdate', { humidity: body.data });
    } else if (body.emit === 'anti-theft') {
      this.appGateway.server.emit('antitheftUpdate', { antitheft: body.data });
    } else if (body.emit === 'detection') {
      this.appGateway.server.emit('detectionUpdate', { detection: body.data });
    }
    // Send a message to all clients
    return { success: true };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
