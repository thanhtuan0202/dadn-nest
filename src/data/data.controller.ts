import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { DataService } from './data.service';
import { adaRequest, publishData } from '../helpers/adahelper';
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}
  @Get('lastled')
  getLastLed(): Promise<JSON> {
    return this.dataService.lastLed();
  }
  @Get('notifications')
  getNotifications(): Promise<JSON> {
    return this.dataService.getNotifications();
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
