import * as React from 'react';
import { Animated } from 'react-native';

export function useSwitchAnimation(params: {
  value: boolean;
  width: number;
  height: number;
  falseColor: string;
  trueColor: string;
  animationDuration: number;
}) {
  const { height, width, value, falseColor, trueColor, animationDuration } =
    params;
  const marginLeft = React.useRef(height * 0.05 < 1 ? 1 : height * 0.05);
  const translateX = React.useRef(
    new Animated.Value(
      value === false ? marginLeft.current : width - height + marginLeft.current
    )
  ).current;
  const trackColorNumber = React.useRef(
    new Animated.Value(value === false ? 0 : 1)
  ).current;
  const trackColor = trackColorNumber.interpolate({
    inputRange: [0, 1],
    outputRange: [falseColor, trueColor],
  });
  const toRight = Animated.parallel([
    Animated.timing(translateX, {
      toValue: width - height + marginLeft.current,
      duration: animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(trackColorNumber, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }),
  ]).start;
  const toLeft = Animated.parallel([
    Animated.timing(translateX, {
      toValue: marginLeft.current,
      duration: animationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(trackColorNumber, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }),
  ]).start;
  return {
    translateX,
    toRight,
    toLeft,
    trackColor,
  };
}
