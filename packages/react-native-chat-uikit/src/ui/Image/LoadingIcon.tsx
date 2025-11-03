import * as React from 'react';
import { Animated, Easing } from 'react-native';

import type { IconNameType } from '../../assets';
import type { ImageProps } from './Image';
import { ClassImage } from './Image.class';
import { getIconSource } from './Image.hooks';

export type LoadingIconResolutionType = '' | '2x' | '3x';
export type LoadingIconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  name?: IconNameType | number;
  resolution?: LoadingIconResolutionType;
  isStop?: boolean;
};

const AnimatedImage = Animated.createAnimatedComponent(ClassImage);

export function LoadingIcon(props: LoadingIconProps) {
  const { name = 'loading', resolution, style, isStop, ...others } = props;
  const deg = React.useRef(new Animated.Value(0)).current;
  const animatedValue = React.useRef<Animated.CompositeAnimation | null>(null);
  const initAnimation = React.useCallback(() => {
    animatedValue.current = Animated.loop(
      Animated.timing(deg, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.linear),
      })
    );
  }, [deg]);
  const startAnimation = React.useCallback(() => {
    animatedValue.current?.start();
  }, [animatedValue]);
  const stopAnimation = React.useCallback(() => {
    animatedValue.current?.stop();
  }, [animatedValue]);
  React.useEffect(() => {
    initAnimation();
    if (isStop === true) {
      stopAnimation();
    } else {
      startAnimation();
    }
    return () => {
      stopAnimation();
    };
  }, [isStop, initAnimation, startAnimation, stopAnimation]);
  return (
    <AnimatedImage
      source={getIconSource(name, resolution) ?? 0}
      style={[
        style,
        {
          transform: [
            {
              rotate: deg.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
      {...others}
    />
  );
}
