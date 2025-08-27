import * as React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';

import { Container } from '../rename.uikit';

export function useModalAnimation(type: string) {
  const { height } = useWindowDimensions();
  const initialY = React.useRef(type === 'slide' ? height : 0).current;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const translateYRef = React.useRef(new Animated.Value(initialY));
  // translateY.setValue(initialY);
  // console.log('test:zuoyu:initialY:', type, height, initialY);

  // translateYRef.current.addListener(({ value }) => {
  // console.log('test:zuoyu:translateY:', value);
  // });

  React.useEffect(() => {
    console.log('test:zuoyu:initialY changed:', initialY);
    translateYRef.current.setValue(initialY);
  }, [initialY]);

  const createAnimated = React.useCallback(
    (toValue: 0 | 1) => {
      const config = { duration: 250, useNativeDriver: false };
      return Animated.parallel([
        Animated.timing(backgroundOpacity, { toValue, ...config }),
        Animated.timing(translateYRef.current, {
          toValue: toValue === 0 ? initialY : 0,
          ...config,
        }),
      ]);
    },
    [backgroundOpacity, initialY]
  );

  const startShow = React.useCallback(
    (callback?: Animated.EndCallback) => {
      createAnimated(1).start(callback);
    },
    [createAnimated]
  );

  const startHide = React.useCallback(
    (callback?: Animated.EndCallback) => {
      createAnimated(0).start(callback);
    },
    [createAnimated]
  );

  return {
    translateY: translateYRef.current,
    backgroundOpacity,
    startShow,
    startHide,
  };
}

export function Test1() {
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation('slide');
  return (
    <View>
      <View
        style={{ height: 300, width: '100%', backgroundColor: 'red' }}
        onTouchEnd={() => {
          startShow();
        }}
      />
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: 'flex-end',
            opacity: backgroundOpacity,
            transform: [{ translateY: translateY }],
          },
        ]}
        pointerEvents={'box-none'}
      >
        <View
          style={{ height: 300, width: '100%', backgroundColor: 'white' }}
          onTouchEnd={() => {
            startHide();
          }}
        />
      </Animated.View>
    </View>
  );
}

export default function TestClosure() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <Test1 />
    </Container>
  );
}
