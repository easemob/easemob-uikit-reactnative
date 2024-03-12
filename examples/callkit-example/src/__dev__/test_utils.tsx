import * as React from 'react';
import { View } from 'react-native';
import { formatElapsed } from 'react-native-chat-callkit';
import { Text1Button } from 'react-native-chat-uikit';

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
