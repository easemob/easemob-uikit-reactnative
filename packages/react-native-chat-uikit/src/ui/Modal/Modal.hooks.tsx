import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  useWindowDimensions,
} from 'react-native';

import type { ModalAnimationType } from './types';

export const useModalAnimation = (type: ModalAnimationType) => {
  const { height } = useWindowDimensions();
  const initialY = React.useRef(type === 'slide' ? height : 0).current;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const translateYRef = React.useRef(new Animated.Value(initialY));
  // translateY.setValue(initialY);
  // console.log('test:zuoyu:initialY:', type, height, initialY);

  // translateYRef.current.addListener(({ value }) => {
  //   console.log('test:zuoyu:translateY:', value);
  // });

  // React.useEffect(() => {
  //   console.log('test:zuoyu:initialY changed:', initialY);
  //   translateYRef.current.setValue(initialY);
  // }, [initialY]);

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
    (callback?: any) => {
      createAnimated(1).start(callback);
    },
    [createAnimated]
  );

  const startHide = React.useCallback(
    (callback?: any) => {
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
};

export const useModalPanResponder = (params: {
  type: ModalAnimationType;
  translateY: Animated.Value;
  startShow: (callback?: any | undefined) => void;
  onRequestModalClose: () => void;
  onMoveShouldSetPanResponder?:
    | ((
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean)
    | undefined;
}): PanResponderInstance => {
  const {
    type,
    translateY,
    onRequestModalClose,
    startShow,
    onMoveShouldSetPanResponder,
  } = params;
  const isHideGesture = React.useCallback(
    (distanceY: number, velocityY: number) => {
      return distanceY > 125 || (distanceY > 0 && velocityY > 0.1);
    },
    []
  );
  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => {
        if (onMoveShouldSetPanResponder) {
          return onMoveShouldSetPanResponder(e, g);
        }
        return g.dy >= 0;
      },
      onMoveShouldSetPanResponder: (e, g) => {
        if (onMoveShouldSetPanResponder) {
          return onMoveShouldSetPanResponder(e, g);
        }
        return g.dy >= 0;
      },
      onPanResponderGrant: (_, __) => {
        // @ts-ignore
        translateY.setOffset(translateY.__getValue());
      },
      onPanResponderMove: (_, { dy }) => {
        return dy >= 0 && translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isHideGesture(dy, vy)) onRequestModalClose();
        else startShow();
      },
    })
  ).current;
  if (type === 'slide') return r;
  else return { panHandlers: {} as any } as PanResponderInstance;
};
