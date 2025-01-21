// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function TestFlexDisplay() {
  const [order, setOrder] = React.useState('1');
  return (
    <View style={{ flex: 1, backgroundColor: 'green', paddingTop: 100 }}>
      <TouchableOpacity
        style={{ height: 80, backgroundColor: 'yellow' }}
        onPress={() => {
          setOrder(order === '1' ? '2' : '1');
        }}
      >
        <Text>{'change display'}</Text>
      </TouchableOpacity>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'orange',
          display: order === '2' ? 'flex' : 'none',
        }}
      />
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'blue',
          display: order === '1' ? 'flex' : 'none',
        }}
      />
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />
    </View>
  );
}

export default function test_flex_display() {
  return <TestFlexDisplay />;
}
