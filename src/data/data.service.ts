import { Injectable } from '@nestjs/common';
import { firebaseDb } from '../config/firebase';
import { Data, Notification } from './interface/data.interface';
import { getDatabase, ref, onValue } from 'firebase/database';
import { adaRequest, publishData } from '../helpers/adahelper';
@Injectable()
export class DataService {
  private database = getDatabase(firebaseDb);
  getHello(): string {
    return 'Hello World!';
  }
  async lastLed(): Promise<JSON> {
    let res: any;
    await adaRequest
      .get(`/feeds/dadn.led/data/last`)
      .then(({ data }) => {
        console.log(data);
        res = data;
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    return res;
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
export class MqttService {}
