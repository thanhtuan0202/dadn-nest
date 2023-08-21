import { connect } from 'mqtt';
import axios from 'axios';
import { DataModule } from '../data/data.module';
import { getDatabase, push, ref } from 'firebase/database';
import { firebaseDb } from '../config/firebase';
const database = getDatabase(firebaseDb);
export class Notification {
  constructor(feed, content, createAt) {
    this.feed = feed;
    this.content = content;
    this.createAt = createAt;
  }
  toString() {
    return JSON.stringify({
      feed: this.feed,
      content: this.content,
      createAt: this.createAt,
    });
  }
  async save() {
    try {
      await push(ref(database, 'notifications'), {
        feed: this.feed,
        content: this.content,
        createAt: this.createAt,
      });
    } catch (error) {
      throw new Error(`Error saving notification: ${error}`);
    }
  }
}
const SaveToDatabase = async (feed, content, createAt) => {
  let newNotification = new Notification(feed, content, createAt);
  await newNotification
    .save()
    .then((res) => {
      console.log(`${content} and saved into database`);
      return true;
    })
    .catch((e) => {
      console.log(`Error ${e}`);
    });
};

const realtimeUpdate = () => {
  let feed_list = [
    'dadn.temperature',
    'dadn.led',
    'dadn.fan',
    'dadn.humidity',
    'dadn.anti-theft',
    'dadn.detection',
  ];
  const username = `${process.env.ADAFRUIT_USERNAME}`;
  const key = `${process.env.ADAFRUIT_KEY}`;
  const host = 'mqtt://io.adafruit.com';
  const client = connect(host, {
    username: username,
    password: key,
  });

  client.on('connect', () => {
    console.log('Connected to adafruit');
    feed_list.map((item) => {
      client.subscribe(`${username}/feeds/${item}`);
    });
  });

  client.on('message', (topic, message) => {
    // Parse the message data as a float
    let data = null;
    let createAt = new Date().toISOString();
    if (!topic.endsWith('dadn.detection')) {
      data = parseInt(message.toString());
    } else {
      data = message.toString();
    }
    if (topic.endsWith('dadn.temperature')) {
      axios
        .post('http://localhost:5000', {
          emit: 'temperature',
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
      // io.emit('temperatureUpdate', { temperature: data });
      console.log(`Temperature: ${data}°C`);
    } else if (topic.endsWith('dadn.humidity')) {
      axios
        .post('http://localhost:5000', {
          emit: 'humidity',
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
      // io.emit('humidityUpdate', { humidity: data });
      console.log(`Humidity: ${data}%`);
    } else if (topic.endsWith('dadn.fan')) {
      axios
        .post('http://localhost:5000', {
          emit: 'fan',
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
      //Save to database
      if (data === 1) {
        SaveToDatabase('Turn on fan', 'dadn.fan', createAt);
      } else {
        SaveToDatabase('Turn off fan', 'dadn.fan', createAt);
      }
      // io.emit('fanUpdate', { fan: data });
      console.log(`Fan: ${data}`);
    } else if (topic.endsWith('dadn.led')) {
      axios
        .post('http://localhost:5000', {
          emit: 'led',
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
      if (data === 1) {
        SaveToDatabase('Turn on light', 'dadn.led', createAt);
      } else {
        SaveToDatabase('Turn off light', 'dadn.led', createAt);
      }
      // io.emit('lightUpdate', { light: data });
      console.log(`Light: ${data}`);
    } else if (topic.endsWith('dadn.anti-theft')) {
      axios
        .post('http://localhost:5000', {
          emit: 'anti-theft',
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
      if (data === 1) {
        SaveToDatabase('Anti theft on', 'dadn.anti-theft', createAt);
      } else {
        SaveToDatabase('Anti theft off', 'dadn.anti-theft', createAt);
      }
      // io.emit('AntiTheftUpdate', { antitheft: data });
      console.log(`Anti-theft: ${data}`);
    } else if (topic.endsWith('dadn.detection')) {
      axios
        .post('http://localhost:5000', {
          emit: 'detection',
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
      //Save to database
      SaveToDatabase(data, 'dadn.detection', createAt);

      // io.emit('DetectionUpdate', { detection: data });
      console.log(`Detection: ${data}`);
    }
  });
};

export default realtimeUpdate;
