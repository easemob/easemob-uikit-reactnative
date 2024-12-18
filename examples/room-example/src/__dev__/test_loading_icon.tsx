import * as React from 'react';
import { View } from 'react-native';

import { LoadingIcon } from '../rename.room';

export default function Test(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
      }}
    >
      <LoadingIcon
        name={'loading'}
        style={{
          height: 40,
          width: 40,
          backgroundColor: 'yellow',
        }}
      />
    </View>
  );
}
