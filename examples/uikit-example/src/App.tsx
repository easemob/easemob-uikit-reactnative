import { AppDev } from './__dev__/AppDev';
import { App } from './demo/App';

const env = require('./env');

let AppWrapper;
try {
  const isDev = env.test;
  if (isDev === true) {
    AppWrapper = AppDev;
  } else {
    AppWrapper = App;
  }
} catch (error) {
  console.warn(error);
}

export default AppWrapper;
