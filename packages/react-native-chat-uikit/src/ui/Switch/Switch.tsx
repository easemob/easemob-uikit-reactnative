import * as React from 'react';
import {
  Animated,
  ColorValue,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../Image';
import { useSwitchAnimation } from './Switch.hooks';

export interface SwitchProps {
  height?: number | undefined;
  width?: number | undefined;
  /**
   * Color of the foreground switch grip.
   */
  thumbColor?: ColorValue | undefined;
  /**
   * Color of the background switch grip.
   */
  thumbBackgroundColor?: ColorValue | undefined;

  /**
   * Custom colors for the switch track
   *
   * Color when false and color when true
   *
   * **Note** Must be an interpolable color value. The color name `red` is not supported. `rgba(1,1,2,1)` is supported.
   */
  trackColor?:
    | {
        false?: ColorValue | null | undefined;
        true?: ColorValue | null | undefined;
      }
    | undefined;

  /**
   * Custom Icons for the switch track
   */
  trackIcon?:
    | {
        false?: IconNameType | null | undefined;
        true?: IconNameType | null | undefined;
      }
    | undefined;

  /**
   * If true the user won't be able to toggle the switch.
   * Default value is false.
   */
  disabled?: boolean | undefined;

  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: ((value: boolean) => Promise<void> | void) | null | undefined;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string | undefined;

  /**
   * The value of the switch. If true the switch will be turned on.
   * Default value is false.
   */
  value?: boolean | undefined;

  /**
   * Set styles, but not size, background color, rounded corners, etc.
   */
  style?: StyleProp<ViewStyle> | undefined;

  /**
   * Set styles for the icon
   */
  iconStyle?: StyleProp<ImageStyle> | undefined;

  /**
   * Set background view
   */
  backgroundView?: React.ReactNode | undefined;

  /**
   * Set animation duration
   */
  animationDuration?: number | undefined;
}

export function Switch(props: SwitchProps) {
  const { colors } = usePaletteContext();
  const {
    style,
    height: propsHeight,
    width: propsWidth,
    value: propsValue,
    onValueChange,
    disabled,
    thumbColor,
    thumbBackgroundColor,
    trackColor: propsTrackColor,
    trackIcon: propsTrackIcon,
    backgroundView,
    iconStyle,
    animationDuration = 100,
  } = props;
  const { getColor } = useColors({
    trackFalse: {
      light: colors.neutral[9],
      dark: colors.neutral[9],
    },
    trackTrue: {
      light: colors.neutral[3],
      dark: colors.neutral[3],
    },
    thumbColor: {
      light: thumbColor ?? colors.neutral[98],
      dark: thumbColor ?? colors.neutral[1],
    },
    thumbBackgroundColor: {
      light: thumbBackgroundColor ?? colors.primary[5],
      dark: thumbBackgroundColor ?? colors.primary[6],
    },
  });

  const height = propsHeight ?? 40;
  const width = propsWidth ?? height * (70 / 40);
  const _value = propsValue ?? false;

  const falseColor = (propsTrackColor?.false ??
    getColor('trackFalse')) as 'string';
  const trueColor = (propsTrackColor?.true ??
    getColor('trackTrue')) as 'string';
  const { translateX, toRight, toLeft, trackColor } = useSwitchAnimation({
    value: _value,
    width,
    height,
    falseColor,
    trueColor,
    animationDuration,
  });

  const _onValueChange = (v: boolean) => {
    if (onValueChange) {
      onValueChange(v);
    }
    if (v === true) {
      toRight();
    } else {
      toLeft();
    }
  };

  if (width < height) {
    throw new Error('width must be greater than height');
  }
  if (height < 20) {
    throw new Error('height must be greater than 20');
  }

  if (typeof falseColor === 'number') {
    throw new Error('falseColor must be number');
  }
  if (typeof trueColor === 'number') {
    throw new Error('trueColor must be number');
  }

  return (
    <Animated.View
      style={[
        style,
        {
          width: width,
          height: height,
          backgroundColor: trackColor,
          borderRadius: width,
          justifyContent: 'center',
          overflow: 'hidden',
        },
      ]}
      onTouchEnd={() => {
        if (disabled === true) {
          return;
        }
        _onValueChange(!_value);
      }}
    >
      {backgroundView ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              position: 'absolute',
              backgroundColor: 'red',
            },
          ]}
        >
          {backgroundView}
        </View>
      ) : null}
      <Animated.View
        style={{
          transform: [{ translateX: translateX }],
          height: height * 0.9,
          width: height * 0.9,
          borderRadius: width * 0.9,
          backgroundColor: getColor('thumbBackgroundColor'),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {propsTrackIcon?.false && propsTrackIcon.true ? (
          <Icon
            name={
              propsValue === true ? propsTrackIcon.true : propsTrackIcon.false
            }
            style={[
              {
                width: height * 0.9,
                height: height * 0.9,
                tintColor: getColor('thumbColor'),
              },
              iconStyle,
            ]}
          />
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}
