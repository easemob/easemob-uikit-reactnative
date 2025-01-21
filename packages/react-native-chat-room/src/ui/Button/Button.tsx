import * as React from 'react';
import {
  GestureResponderEvent,
  ImageStyle,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import type { IconNameType } from '../../assets';
import { ErrorCode, UIKitError } from '../../error';
import type {
  ButtonColors,
  ButtonSizesType,
  ButtonStyleType,
  CornerRadiusPaletteType,
} from '../../theme';
import { Icon } from '../Image';
import { Text } from '../Text';
import { gMaxTimeout } from './Button.const';
import {
  useGetButtonRadiusStyle,
  useGetButtonSizeStyle,
  useGetButtonStateStyle,
  useGetButtonStyle,
} from './Button.hooks';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | undefined;
  buttonStyle: ButtonStyleType;
  sizesType: ButtonSizesType;
  radiusType: CornerRadiusPaletteType;
  contentType:
    | 'only-text'
    | 'only-icon'
    | 'icon-text'
    | 'text-icon'
    | 'loading';
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  icon?: IconNameType;
  iconStyle?: StyleProp<ImageStyle>;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
};

/**
 * The native component `Button` is not easy to use. Here we use `Pressable` to simulate the button effect and support button status and theme.
 */
export function Button(props: ButtonProps) {
  const {
    style,
    buttonStyle,
    preventHighFrequencyClicks = true,
    frequencyInterval = gMaxTimeout,
    disabled,
    onPress,
    ...others
  } = props;
  const buttonSize = useGetButtonSizeStyle(props);
  const { state: buttonState } = useGetButtonStyle(props);

  const buttonRadius = useGetButtonRadiusStyle(props);
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

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        let buttonColors: ButtonColors;
        if (state.pressed === true) {
          buttonColors = buttonState.pressed;
        } else {
          if (disabled === true) {
            buttonColors = buttonState.disabled;
          } else {
            buttonColors = buttonState.enabled;
          }
        }
        return [
          buttonSize.button,
          {
            backgroundColor: buttonColors.backgroundColor,
            borderRadius: buttonRadius,
            borderWidth: buttonStyle === 'borderButton' ? 1 : undefined,
            borderColor:
              buttonStyle === 'borderButton'
                ? buttonColors.borderColor
                : undefined,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ];
      }}
      {...others}
    >
      <ButtonContent {...props} />
    </Pressable>
  );
}

const ButtonContent = (props: ButtonProps): JSX.Element => {
  const { contentType, text, icon, textStyle, iconStyle } = props;
  const buttonSize = useGetButtonSizeStyle(props);
  const buttonState = useGetButtonStateStyle(props);
  switch (contentType) {
    case 'icon-text':
      return (
        <View style={{ flexDirection: 'row' }}>
          <Icon
            style={[
              {
                width: buttonSize.icon.size,
                height: buttonSize.icon.size,
                tintColor: buttonState.color,
                // backgroundColor: buttonState.backgroundColor,
              },
              iconStyle,
            ]}
            name={icon ?? 'star_fill'}
          />
          <View style={{ width: 4 }} />
          <Text
            style={[buttonSize.text, { color: buttonState.color }, textStyle]}
          >
            {text}
          </Text>
        </View>
      );
    case 'only-icon':
      return (
        <Icon
          style={[
            {
              width: buttonSize.icon.size,
              height: buttonSize.icon.size,
              tintColor: buttonState.color,
              // backgroundColor: buttonState.backgroundColor,
            },
            iconStyle,
          ]}
          name={icon ?? 'star_fill'}
        />
      );
    case 'only-text':
      return (
        <Text
          style={[buttonSize.text, { color: buttonState.color }, textStyle]}
        >
          {text}
        </Text>
      );
    case 'text-icon':
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[buttonSize.text, { color: buttonState.color }, textStyle]}
          >
            {text}
          </Text>
          <Icon
            style={[
              {
                width: buttonSize.icon.size,
                height: buttonSize.icon.size,
                tintColor: buttonState.color,
                // backgroundColor: buttonState.backgroundColor,
              },
              iconStyle,
            ]}
            name={icon ?? 'star_fill'}
          />
        </View>
      );

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `contentType: ${contentType}`,
  });
};
