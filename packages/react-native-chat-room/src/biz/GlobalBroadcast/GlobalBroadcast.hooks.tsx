import { Animated } from 'react-native';

export const createCompose = (params: {
  x: Animated.Value;
  startX: number;
  endX: number;
  contentWidth: number;
  width: number;
  speed?: number;
}) => {
  const { x, startX, endX, contentWidth, width, speed = 8.0 } = params;
  x.setValue(0);

  if (contentWidth < width) {
    const start = Animated.timing(x, {
      toValue: startX,
      useNativeDriver: true,
      duration: 3000,
    });
    return { compose: Animated.sequence([start]).start };
  } else {
    const ms = (contentWidth / (speed * 10)) * 1000;
    const start = Animated.timing(x, {
      toValue: startX,
      useNativeDriver: true,
      duration: 2000,
    });
    const scrolling = Animated.timing(x, {
      toValue: endX,
      useNativeDriver: true,
      duration: ms,
    });
    const end = Animated.timing(x, {
      toValue: endX,
      useNativeDriver: true,
      duration: 2000,
    });
    return { compose: Animated.sequence([start, scrolling, end]).start };
  }
};
