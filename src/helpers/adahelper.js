import axios from 'axios';
import { connect } from 'mqtt';
const adaRequest = axios.create({
  baseURL: `https://io.adafruit.com/api/v2/nttuan09`,
  headers: {
    'X-AIO-Key': 'aio_NXIE91hb5GoTvsnkoetjOhkMIn0p',
    'Content-Type': 'application/json',
  },
});

function publishData(feedName, data, callback) {
  const broker = 'mqtt://io.adafruit.com';
  const port = 1883;
  const username = 'nttuan09';
  const password = 'aio_NXIE91hb5GoTvsnkoetjOhkMIn0p';
  const client = connect(broker, {
    port: port,
    username: username,
    password: password,
  });
  const jsonData = JSON.stringify({
    value: data,
  });
  client.on('connect', function () {
    client.publish(`${username}/feeds/${feedName}`, jsonData, (error) => {
      if (error !== undefined) {
        callback(false);
      } else {
        callback(true);
      }
      client.end();
    });
  });
}
export { adaRequest, publishData };
