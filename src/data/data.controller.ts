import { Controller, Get, Post, Req, Res, Body, Query } from '@nestjs/common';
import { DataService } from './data.service';
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('hello')
  getHello() {
    return this.dataService.getHello();
  }

  @Get('gettemperature')
  async getTemperature(@Query() type: any) {
    return {
      data: type,
    };
  }

  @Get('lastled')
  async getLastLed(@Res() res: any): Promise<any> {
    res.status(200).json(await this.dataService.lastLed());
  }

  @Get('notifications')
  async getNotifications(): Promise<JSON> {
    return this.dataService.getNotifications();
  }

  @Get('lastfan')
  async getLastFan(@Res() res: any) {
    res.status(200).json(await this.dataService.lastFan());
  }

  @Post('setled')
  setLed(@Req() req: any, @Res() res: any): void {
    const { value } = req.body;
    if (this.dataService.setLed(value)) {
      res.status(201).json({
        message: 'Set data successful',
      });
    } else {
      res.status(400).json({ message: 'Set data failed' });
    }
    // return JSON.parse(JSON.stringify({value: value}));
  }
}