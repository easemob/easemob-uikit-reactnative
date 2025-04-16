import * as React from 'react';

import { AppDev } from './__dev__/index';
import { App } from './demo/App';

const env = require('./env');
const reactStrictMode = env.reactStrictMode ?? false;
const isDev = env.test ?? false;

const AppWrapper = () => {
  if (reactStrictMode) {
    if (isDev) {
      return (
        <React.StrictMode>
          <AppDev />
        </React.StrictMode>
      );
    } else {
      return (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  } else {
    if (isDev) {
      return <AppDev />;
    } else {
      return <App />;
    }
  }
};

export default AppWrapper;
