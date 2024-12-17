import * as React from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  View,
} from 'react-native';

const useAnimation = () => {
  const input = React.useRef(new Animated.Value(0)).current;
  const emoji = React.useRef(new Animated.Value(-336)).current;

  const createAnimation = (type: 'show' | 'hide') => {
    return Animated.parallel([
      Animated.timing(input, {
        toValue: type === 'show' ? -336 : 0,
        useNativeDriver: false,
        duration: 250,
        easing: Easing.ease,
      }),
      Animated.timing(emoji, {
        toValue: type === 'show' ? 0 : -336,
        useNativeDriver: false,
        duration: 250,
        easing: Easing.ease,
      }),
    ]).start;
  };

  return {
    translateY: input,
    emojiBottom: emoji,
    show: createAnimation('show'),
    hide: createAnimation('hide'),
  };
};

export function TestKeyboard() {
  const { translateY, emojiBottom, show, hide } = useAnimation();
  const noMove = React.useRef(false);

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
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View>
          <View style={{ flexDirection: 'row', flex: 1, width: 300 }}>
            <View
              style={{ width: 100, flexGrow: 1, backgroundColor: 'blue' }}
              onTouchEnd={() => {
                noMove.current = true;
                Keyboard.dismiss();
              }}
            />
            <View
              style={{ width: 100, backgroundColor: 'red' }}
              onTouchEnd={() => {
                noMove.current = false;
                Keyboard.dismiss();
              }}
            />
            <View
              style={{ width: 100, backgroundColor: 'orange' }}
              onTouchEnd={() => {
                noMove.current = false;
                hide();
              }}
            />
          </View>
          <Animated.View style={{ transform: [{ translateY: translateY }] }}>
            <TextInput
              style={{ backgroundColor: 'yellow', height: 100 }}
              onLayout={(e) => {
                if (e.nativeEvent) console.log('test:onLayout:', e.nativeEvent);
              }}
              onFocus={(e) => {
                console.log('test:onFocus:', e.nativeEvent);
                show();
              }}
              onBlur={(e) => {
                console.log('test:onBlur:', e.nativeEvent);
                if (noMove.current === false) {
                  hide();
                }
              }}
            />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'gray',
              height: 336,
              width: '100%',
              bottom: emojiBottom,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function test_keyboard() {
  return <TestKeyboard />;
}
