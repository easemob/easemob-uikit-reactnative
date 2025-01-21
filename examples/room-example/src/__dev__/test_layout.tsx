// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function TestLayout() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <View style={{ height: 300, width: 300, backgroundColor: 'red' }}>
        <View
          style={{
            height: 100,
            width: 100,
            minHeight: 50,
            maxHeight: 200,
            backgroundColor: 'blue',
            // flex: 1, // minHeight
            // flexShrink: 1,
            // flexGrow: 1, // maxHeight
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

export function TestLayout2() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <View
        style={{
          height: 300,
          width: 300,
          backgroundColor: 'red',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            // minHeight: 50,
            // maxHeight: 200,
            minWidth: 50,
            maxWidth: 200,
            backgroundColor: 'blue',
            // flex: 1, // minWidth
            // flexShrink: 1,
            // flexGrow: 1, // maxWidth
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

export default function test_layout() {
  return <TestLayout2 />;
}
