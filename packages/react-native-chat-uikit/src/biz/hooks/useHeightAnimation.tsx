import * as React from 'react';
import { Animated } from 'react-native';

export function useHeightAnimation(params: {
  initHeight: number;
  duration?: number;
}) {
  const { initHeight, duration = 250 } = params;
  const currentHeight = React.useRef(new Animated.Value(initHeight)).current;

  const heightAnimate = React.useCallback(
    (
      toValue: number,
      onFinished?: (result: Animated.EndResult) => void,
      offsetToZero?: boolean
    ) => {
      if (offsetToZero === true) {
        currentHeight.setOffset(0);
      }
      Animated.timing(currentHeight, {
        toValue,
        duration: duration,
        useNativeDriver: false,
      }).start(onFinished);
    },
    [currentHeight, duration]
  );

  return {
    currentHeight,
    heightAnimate,
  };
}
