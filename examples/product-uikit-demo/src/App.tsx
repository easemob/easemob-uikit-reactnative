import * as React from 'react';

import { App } from './demo/App';

const env = require('./env');
const reactStrictMode = env.reactStrictMode ?? false;

const AppWrapper = () => {
  if (reactStrictMode) {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    return <App />;
  }
};

export default AppWrapper;
