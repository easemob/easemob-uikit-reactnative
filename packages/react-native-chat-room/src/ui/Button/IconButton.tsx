import * as React from 'react';
import type {
  GestureResponderEvent,
  ImageStyle,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Pressable, PressableStateCallbackType } from 'react-native';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import type { ButtonColors } from '../../theme';
import { ButtonStateColor, usePaletteContext } from '../../theme';
import type { PartialDeep } from '../../types';
import { Icon, IconResolutionType } from '../Image';
import { gMaxTimeout } from './Button.const';

export type IconButtonProps = Pick<PressableProps, 'onPress' | 'disabled'> & {
  style?: StyleProp<ImageStyle> | undefined;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  iconName: IconNameType;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
  buttonStateColors?: PartialDeep<ButtonStateColor>;
  iconResolution?: IconResolutionType;
};

export function IconButton(props: IconButtonProps) {
  const {
    style,
    containerStyle,
    preventHighFrequencyClicks = true,
    frequencyInterval = gMaxTimeout,
    disabled,
    onPress,
    iconName,
    buttonStateColors,
    iconResolution,
  } = props;

  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    enabled_color: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    disabled_color: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    pressed_color: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });

  const clicked = React.useRef(false);

  const onPressInternal = (event: GestureResponderEvent) => {
    if (preventHighFrequencyClicks === true) {
      if (onPress) {
        if (clicked.current === false) {
          setTimeout(() => {
            clicked.current = false;
          }, frequencyInterval);
          clicked.current = true;
          onPress(event);
        }
      }
    } else {
      onPress?.(event);
    }
  };

  const buttonState = (): PartialDeep<ButtonStateColor> => {
    if (buttonStateColors) {
      return buttonStateColors;
    }
    return {
      enabled: {
        color: getColor('enabled_color'),
        backgroundColor: undefined,
        borderColor: undefined,
      },
      disabled: {
        color: getColor('disabled_color'),
        backgroundColor: undefined,
        borderColor: undefined,
      },
      pressed: {
        color: getColor('pressed_color'),
        backgroundColor: undefined,
        borderColor: undefined,
      },
    };
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        let buttonColors: ButtonColors;
        if (state.pressed === true) {
          buttonColors = buttonState().pressed?.backgroundColor as any;
        } else {
          if (disabled === true) {
            buttonColors = buttonState().disabled?.backgroundColor as any;
          } else {
            buttonColors = buttonState().enabled?.backgroundColor as any;
          }
        }
        return [
          {
            backgroundColor: buttonColors?.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
          containerStyle,
        ];
      }}
    >
      <Icon
        name={iconName}
        style={[
          {
            tintColor: buttonState().enabled?.color as any,
          },
          style,
        ]}
        resolution={iconResolution}
      />
    </Pressable>
  );
}

const IconButtonCompare = (
  prevProps: Readonly<IconButtonProps>,
  nextProps: Readonly<IconButtonProps>
) => {
  if (prevProps.iconName !== nextProps.iconName) {
    return false;
  }
  return true;
};

export const IconButtonMemo = React.memo(IconButton, IconButtonCompare);
