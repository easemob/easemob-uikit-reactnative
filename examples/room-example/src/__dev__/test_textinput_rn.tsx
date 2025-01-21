// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Platform, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const gMaxHeight = 100;

export function TestChatroom() {
  const { width: winWidth } = useWindowDimensions();
  const fontSize = 18;
  const [_maxHeight, _setMaxHeight] = React.useState(0);
  const getMaxHeight = () => {
    return Platform.OS === 'ios'
      ? 91
      : _maxHeight === 0
      ? gMaxHeight
      : _maxHeight;
  };
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <View
        style={{
          height: 300,
          width: winWidth,
          backgroundColor: 'red',
        }}
      >
        <View
          style={{
            // height: 28,
            // width: 100,
            // minHeight: 28,
            maxHeight: getMaxHeight(),
            backgroundColor: 'yellow',
            // flex: 1,
            // flexShrink: 1,
            // flexGrow: 1,
          }}
        >
          <TextInput
            ref={{} as any}
            textAlignVertical={'top'}
            style={{ fontSize: fontSize }}
            numberOfLines={4}
            multiline={true}
            // onLayout={(e) => {
            //   console.log('test:zuoyu:onLayout:', e.nativeEvent.layout);
            // }}
            // onChangeText={(t) => {
            //   console.log('test:zuoyu:onChangeText:', t);
            // }}
            // onTextInput={(e) => {
            //   console.log('test:zuoyu:onTextInput:', e.nativeEvent);
            //   if (e.nativeEvent.text === '\n') {
            //     console.log('test:zuoyu:onTextInput:2');
            //   }
            // }}
            // onChange={(e) => {
            //   console.log('test:zuoyu:onChange:', e.nativeEvent);
            // }}
            onContentSizeChange={(e) => {
              if (Platform.OS === 'ios') {
              } else {
                _setMaxHeight(
                  Math.min(e.nativeEvent.contentSize.height, gMaxHeight)
                );
              }
            }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default function test_textinput() {
  return <TestChatroom />;
}
