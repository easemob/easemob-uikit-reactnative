import * as React from 'react';

import DevApp from './test_alert';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
