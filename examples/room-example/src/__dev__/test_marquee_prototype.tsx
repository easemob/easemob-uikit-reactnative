// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Animated, Button, ScrollView, Text, View } from 'react-native';

export function TestGlobalBroadcast2() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const content =
    'jskdfjsdkjfksdjflsdfkjsldfkjsldfkjsdlfkjsdlfkjsdflksdjflksdjflskdfjlsdkfjsldkfjsldfkjsdlfkj';
  const [decelerationRate, setDecelerationRate] = React.useState(100);
  const ref = React.useRef<ScrollView>({} as any);
  return (
    <View style={{ flex: 1, backgroundColor: 'green', paddingTop: 100 }}>
      <Button
        title="start rolling"
        onPress={() => {
          ref.current.scrollToEnd();
        }}
      />
      <Button
        title="reset rolling"
        onPress={() => {
          ref.current.scrollTo({ x: 0 });
        }}
      />
      <Button
        title="+ acc"
        onPress={() => {
          setDecelerationRate(decelerationRate + 0.1);
        }}
      />
      <Button
        title="- acc"
        onPress={() => {
          setDecelerationRate(decelerationRate - 0.1);
        }}
      />
      <View style={{ height: 100 }} />
      <View style={{ flex: 0, height: 40, backgroundColor: 'yellow' }}>
        <Animated.ScrollView
          ref={ref}
          horizontal={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
              listener: (_) => {},
            }
          )}
          decelerationRate={decelerationRate}
        >
          <View style={{ width: 1000 }}>
            <Text>{content}</Text>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

export function TestGlobalBroadcast() {
  const content =
    'jskdfjsdkjfksdjflsdfkjsldfkjsldfkjsdlfkjsdlfkjsdflksdjflksdjflskdfjlsdkfjsldkfjsldfkjsdlfkj';
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const createAnimation = (params: { length: number }) => {
    scrollX.setValue(0);

    return {
      startRolling: Animated.timing(scrollX, {
        toValue: params.length,
        useNativeDriver: true,
        duration: 1000,
      }).start,
    };
  };
  const animate = React.useRef<ReturnType<typeof createAnimation>>({} as any);

  React.useEffect(() => {
    scrollX.addListener(() => {});
    return () => {
      scrollX.removeAllListeners();
    };
  }, [scrollX]);
  return (
    <View style={{ flex: 1, backgroundColor: 'green', paddingTop: 100 }}>
      <Button
        title="start rolling"
        onPress={() => {
          animate.current = createAnimation({ length: 1000 });
          animate.current.startRolling(() => {});
        }}
      />
      <Button title="reset rolling" onPress={() => {}} />
      <View style={{ height: 100 }} />
      <View style={{ flex: 0, height: 40, backgroundColor: 'yellow' }}>
        <Animated.ScrollView
          horizontal={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
            }
          )}
        >
          <View style={{ width: 1000 }}>
            <Text>{content}</Text>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

export default function test_globalBroadcast_prototype() {
  return <TestGlobalBroadcast2 />;
}
