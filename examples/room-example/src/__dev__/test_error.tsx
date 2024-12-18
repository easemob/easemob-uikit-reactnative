import * as React from 'react';
import { View } from 'react-native';

import { ErrorCode, UIKitError } from '../rename.room';

function throwError() {
  const e = new UIKitError({ code: ErrorCode.existed });
  throw e;
}

export function TestError() {
  throwError();
  return (
    <View
      style={{ top: 100, width: 100, height: 100, backgroundColor: 'red' }}
    />
  );
}

export default function test_error() {
  return <TestError />;
}
