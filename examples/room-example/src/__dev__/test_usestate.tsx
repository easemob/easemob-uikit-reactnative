// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function TestUseState() {
  console.log('test:TestUseState:');
  const [content, setContent] = React.useState('');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        top: 100,
      }}
    >
      <TouchableOpacity
        style={{ height: 40, width: 100 }}
        onPress={() => {
          setContent('no change');
        }}
      >
        <Text>{'test use state'}</Text>
      </TouchableOpacity>
      <Text>{content}</Text>
    </View>
  );
}

export default function test_usestate() {
  return <TestUseState />;
}
