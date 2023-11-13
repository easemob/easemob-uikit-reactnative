import * as React from 'react';

import { AppDev } from './__dev__/AppDev';

const env = require('./env');

export function App() {
  return <></>;
}

let AppWrapper = App;
try {
  const isDev = env.test;
  if (isDev === true) {
    AppWrapper = AppDev;
  }
} catch (error) {
  console.warn(error);
}

export default AppWrapper;
