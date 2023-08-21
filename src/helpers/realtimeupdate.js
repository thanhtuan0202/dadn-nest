import { connect } from 'mqtt';
import axios from 'axios';
const realtimeUpdate = (io) => {
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
    if (!topic.endsWith('dadn.person')) {
      data = parseFloat(message.toString());
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
      // Emit a "lightUpdate" event with the new light data
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
      // io.emit('DetectionUpdate', { detection: data });
      console.log(`Detection: ${data}`);
    }
  });
};

export default realtimeUpdate;
