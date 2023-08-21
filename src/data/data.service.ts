import { Injectable } from '@nestjs/common';
import { firebaseDb } from '../config/firebase';
import { Data, Notification } from './interface/data.interface';
import { getDatabase, ref, onValue } from 'firebase/database';
import {  publishData } from '../helpers/adahelper';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import * as process from "process";
@Injectable()
export class DataService {
  constructor(private readonly httpService: HttpService) {}
  private database = getDatabase(firebaseDb);

  getHello(): string {
    return 'Hello World!';
  }
  async lastLed() {
    const url = `https://io.adafruit.com/api/v2/${process.env.ADAFRUIT_USERNAME}/feeds/dadn.led/data/last`; // URL you want to fetch data from
    const config = {
      headers: {
        'X-AIO-Key': process.env.ADAFRUIT_KEY,
        'Content-Type': 'application/json',
      },
    }
    try {
      const response = await this.httpService.get(url,config).toPromise();
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async setLed(value: any): Promise<boolean> {
    let res: boolean;
    publishData('dadn.led', value, (result: any) => {
      if (result) {
        res = true;
      }
      else {
        res = false
      }
    });
    return res;
  }
  async getNotifications(): Promise<JSON> {
    let res: any;
    const noti = ref(this.database, 'notifications');
    const notifications = [];
    onValue(noti, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const key = Object.keys(data);
        key.forEach((val) => {
          notifications.push({
            feed: data[val].feed,
            content: data[val].content,
            createAt: data[val].createAt,
          });
        });
        const notiArray = Object.keys(data).map((key) => ({
          postId: key,
          ...data[key],
        }));
        notifications.sort((a, b) => a.createAt - b.createAt);
        res = {
          notiArray,
          message: 'success',
        };
        return res;
      } else {
        console.log('No data found.');
      }
    });
    return res;
  }
}

