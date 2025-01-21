// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import {
  Keyboard,
  // KeyboardAvoidingView as RNKeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  TextInput,
  View,
} from 'react-native';

import { KeyboardAvoidingView } from '../rename.room';

export function TestKeyboard() {
  const closeEmoji = React.useRef(false);
  const closeKeyboard = React.useRef(false);
  const [emojiHeight, setEmojiHeight] = React.useState(0);

  React.useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', (e) => {
      console.log('test:keyboardDidShow:', e);
    });
    const s2 = Keyboard.addListener('keyboardWillShow', (e) => {
      console.log('test:keyboardWillShow:', e);
    });
    const s3 = Keyboard.addListener('keyboardDidHide', (e) => {
      console.log('test:keyboardDidHide:', e);
    });
    const s4 = Keyboard.addListener('keyboardWillHide', (e) => {
      console.log('test:keyboardWillHide:', e);
    });
    const s5 = Keyboard.addListener('keyboardDidChangeFrame', (e) => {
      console.log('test:keyboardDidChangeFrame:', e);
    });
    const s6 = Keyboard.addListener('keyboardWillChangeFrame', (e) => {
      console.log('test:keyboardWillChangeFrame:', e);
    });
    return () => {
      s1.remove();
      s2.remove();
      s3.remove();
      s4.remove();
      s5.remove();
      s6.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View
          style={{ flex: 1, backgroundColor: 'yellow', height: '100%' }}
          onTouchEnd={() => {
            closeKeyboard.current = true;
            closeEmoji.current = true;
            Keyboard.dismiss();
          }}
        />
        <View
          style={{ flex: 1, backgroundColor: 'blue', height: '100%' }}
          onTouchEnd={() => {
            closeKeyboard.current = false;
            closeEmoji.current = true;
            LayoutAnimation.configureNext({
              duration: 250, // from keyboard event
              update: {
                duration: 250,
                type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
              },
            });
            setEmojiHeight(0);
          }}
        />
        <View
          style={{ flex: 1, backgroundColor: 'orange', height: '100%' }}
          onTouchEnd={() => {
            closeKeyboard.current = true;
            closeEmoji.current = false;
            Keyboard.dismiss();
          }}
        />
      </View>
      <KeyboardAvoidingView
        style={{
          backgroundColor: 'blue',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TextInput
          style={{
            backgroundColor: 'red',
            height: 100,
          }}
          onFocus={() => {
            console.log('test:onFocus:');
            closeKeyboard.current = false;
            closeEmoji.current = false;

            LayoutAnimation.configureNext({
              duration: 250, // from keyboard event
              update: {
                duration: 250,
                type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
              },
            });
            setEmojiHeight(Platform.OS === 'ios' ? 336 : 0);
          }}
          onBlur={() => {
            console.log('test:onBlur:');
            if (closeEmoji.current === true) {
              LayoutAnimation.configureNext({
                duration: 250, // from keyboard event
                update: {
                  duration: 250,
                  type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
                },
              });
              setEmojiHeight(Platform.OS === 'ios' ? 0 : 284);
            }
          }}
        />
      </KeyboardAvoidingView>
      <View style={{ backgroundColor: 'gray', height: emojiHeight }} />
    </View>
  );
}

export default function test_keyboard() {
  return <TestKeyboard />;
}
