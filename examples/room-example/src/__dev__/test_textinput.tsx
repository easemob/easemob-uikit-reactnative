// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TextInput } from '../rename.room';

export function TestChatroom() {
  const { width: winWidth } = useWindowDimensions();
  const fontSize = 18;
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <View
        style={{
          height: 300,
          width: winWidth,
          backgroundColor: 'red',
        }}
      >
        <TextInput
          textAlignVertical={'top'}
          style={{ fontSize: fontSize }}
          numberOfLines={4}
          multiline={true}
          unitHeight={Platform.OS === 'ios' ? 23 : 25}
          containerStyle={{
            backgroundColor: 'yellow',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

export default function test_textinput() {
  return <TestChatroom />;
}
