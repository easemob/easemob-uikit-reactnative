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

export const useSimulativeModalAnimation = (type: ModalAnimationType) => {
  const { height } = useWindowDimensions();
  const initialY = type === 'slide' ? height : 0;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(initialY)).current;
  // translateY.setValue(initialY);

  const createAnimated = (toValue: 0 | 1) => {
    const config = { duration: 250, useNativeDriver: false };
    return Animated.parallel([
      Animated.timing(backgroundOpacity, { toValue, ...config }),
      Animated.timing(translateY, {
        toValue: toValue === 0 ? initialY : 0,
        ...config,
      }),
    ]).start;
  };

  return {
    translateY,
    backgroundOpacity,
    startShow: createAnimated(1),
    startHide: createAnimated(0),
  };
};

export const useSimulativeModalPanResponder = (params: {
  type: ModalAnimationType;
  translateY: Animated.Value;
  startShow: (callback?: Animated.EndCallback | undefined) => void;
  startHide: (callback?: Animated.EndCallback | undefined) => void;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onStartShouldSetPanResponder?:
    | ((
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean)
    | undefined;
}): PanResponderInstance => {
  const {
    type,
    translateY,
    setModalVisible,
    startHide,
    startShow,
    onStartShouldSetPanResponder,
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
        if (onStartShouldSetPanResponder) {
          return onStartShouldSetPanResponder(e, g);
        }
        return g.dy > 8;
      },
      onMoveShouldSetPanResponder: (e, g) => {
        if (onStartShouldSetPanResponder) {
          return onStartShouldSetPanResponder(e, g);
        }
        return g.dy > 8;
      },
      onPanResponderGrant: (_, __) => {
        // @ts-ignore
        translateY.setOffset(translateY.__getValue());
      },
      onPanResponderMove: (_, { dy }) => {
        return dy >= 0 && translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isHideGesture(dy, vy)) {
          startHide(() => setModalVisible(false));
        } else {
          startShow();
        }
      },
    })
  ).current;
  if (type === 'slide') return r;
  else return { panHandlers: {} };
};
