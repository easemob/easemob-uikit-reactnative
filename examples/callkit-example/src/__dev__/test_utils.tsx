import * as React from 'react';
import { View } from 'react-native';

import { formatElapsed } from '../rename.callkit';
import { Text1Button } from '../ui/Button';

export default function TestUtils(): JSX.Element {
  return (
    <View style={{ top: 100 }}>
      <Text1Button
        onPress={() => {
          const ret = formatElapsed(11125000);
          console.log('test:ret:', ret);
        }}
        text={'formatElapsed'}
      />
    </View>
  );
}
