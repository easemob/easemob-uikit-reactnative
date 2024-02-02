import * as React from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { IconName, LocalIcon } from './LocalIcon';

type IconButtonProps = {
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  color?: string;
  backgroundColor?: string;
  iconName?: IconName;
  size?: number;
  containerSize?: number;
  isLoading?: boolean;
};

export function IconButton(props: IconButtonProps): JSX.Element {
  const {
    disabled,
    onPress,
    color,
    backgroundColor,
    iconName,
    size,
    containerSize,
    isLoading,
  } = props;
  const clickTimeoutRef = React.useRef(true);
  const onPressInternal = (event: GestureResponderEvent) => {
    if (clickTimeoutRef.current === true) {
      clickTimeoutRef.current = false;
      setTimeout(() => {
        clickTimeoutRef.current = true;
      }, 1000);
      onPress?.(event);
    }
  };
  return (
    <TouchableOpacity
      style={{
        height: containerSize ?? 64,
        width: containerSize ?? 64,
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: containerSize ? containerSize / 2 : undefined,
      }}
      disabled={disabled}
      onPress={onPressInternal}
    >
      {isLoading === true ? (
        <Rotate style={{}}>
          <LocalIcon
            name={iconName ?? 'default_avatar'}
            color={color}
            size={size}
          />
        </Rotate>
      ) : (
        <LocalIcon
          name={iconName ?? 'default_avatar'}
          color={color}
          size={size}
        />
      )}
    </TouchableOpacity>
  );
}

const useLoopAnimated = (duration: number, useNativeDriver = true) => {
  const animated = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animated, {
        toValue: 1,
        duration,
        useNativeDriver,
        easing: Easing.inOut(Easing.linear),
      }),
      { resetBeforeIteration: true }
    ).start();

    return () => {
      animated.stopAnimation();
      animated.setValue(0);
    };
  }, [animated, duration, useNativeDriver]);

  return animated;
};

const Rotate = ({
  children,
  style,
}: React.PropsWithChildren<{ style: StyleProp<ViewStyle> }>) => {
  const loop = useLoopAnimated(1000);
  const rotate = loop.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[style, { transform: [{ rotate }] }]}
    >
      {children}
    </Animated.View>
  );
};
