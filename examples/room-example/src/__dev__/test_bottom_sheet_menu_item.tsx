import * as React from 'react';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  DispatchContextProvider,
  ErrorCode,
  Icon,
  type IconNameType,
  type IconResolutionType,
  PaletteContextProvider,
  Text,
  ThemeContextProvider,
  UIKitError,
  usePaletteContext,
  useThemeContext,
} from '../rename.room';

type ButtonInitState = 'enabled' | 'disabled' | 'warned';
type ButtonState = 'disabled' | 'enabled' | 'pressed' | 'warned';

export type BottomSheetMenuItemProps = {
  id: string;
  initState: ButtonInitState;
  text: string;
  iconName?: IconNameType;
  onPress?: () => void;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
  iconResolution?: IconResolutionType;
  containerStyle?: StyleProp<ViewStyle>;
};

export function BottomSheetMenuItem(props: BottomSheetMenuItemProps) {
  console.log('test:BottomSheetMenuItem');
  const {
    id,
    initState,
    text,
    iconName,
    onPress,
    preventHighFrequencyClicks,
    frequencyInterval,
    iconResolution,
    containerStyle,
  } = props;
  const clicked = React.useRef(false);
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const disabled = initState === 'disabled' ? true : false;
  const warned = initState === 'warned' ? true : false;
  const [buttonState, setButtonState] = React.useState<ButtonState>(
    disabled === true ? 'disabled' : warned === true ? 'warned' : 'enabled'
  );

  const onPressInternal = () => {
    if (preventHighFrequencyClicks === true) {
      if (onPress) {
        if (clicked.current === false) {
          setTimeout(() => {
            clicked.current = false;
          }, frequencyInterval);
          clicked.current = true;
          onPress?.();
        }
      }
    } else {
      onPress?.();
    }
  };

  const getBackgroundColor = () => {
    return {
      disabled:
        style === 'light' ? colors.neutral[98] : colors.barrage.onLight[1],
      enabled:
        style === 'light' ? colors.neutral[98] : colors.barrage.onLight[1],
      pressed:
        style === 'light' ? colors.neutral[95] : colors.barrage.onLight[1],
    };
  };

  const getColor = (state: ButtonState) => {
    const c = {
      disabled:
        style === 'light' ? colors.neutral[7] : colors.barrage.onLight[1],
      enabled:
        style === 'light' ? colors.primary[5] : colors.barrage.onLight[1],
      pressed:
        style === 'light' ? colors.primary[4] : colors.barrage.onLight[1],
      warned: style === 'light' ? colors.error[5] : colors.barrage.onLight[1],
    };
    switch (state) {
      case 'warned':
        return c.warned;
      case 'disabled':
        return c.disabled;
      case 'enabled':
        return c.enabled;
      case 'pressed':
        return c.pressed;
      default:
        break;
    }
    throw new UIKitError({ code: ErrorCode.params });
  };

  return (
    <Pressable
      key={id}
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        let buttonColors;
        if (state.pressed === true) {
          buttonColors = getBackgroundColor().pressed;
          setButtonState(initState === 'warned' ? 'warned' : 'pressed');
        } else {
          if (disabled === true) {
            buttonColors = getBackgroundColor().disabled;
            setButtonState('disabled');
          } else {
            buttonColors = getBackgroundColor().enabled;
            setButtonState(initState === 'warned' ? 'warned' : 'enabled');
          }
        }
        return [
          {
            backgroundColor: buttonColors,
            justifyContent: iconName ? 'flex-start' : 'center',
            alignItems: 'center',
          },
          containerStyle,
        ];
      }}
    >
      {iconName ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            alignItems: 'center',
            paddingLeft: 16,
          }}
        >
          <Icon
            name={iconName}
            style={[
              {
                tintColor: getColor(buttonState),
                height: 22,
                width: 22,
              },
            ]}
            resolution={iconResolution}
          />
          <View style={{ width: 2 }} />
          <Text
            paletteType={'body'}
            textType={'large'}
            style={{ color: getColor(buttonState) }}
          >
            {text}
          </Text>
        </View>
      ) : (
        <Text
          paletteType={'body'}
          textType={'large'}
          style={{ color: getColor(buttonState) }}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
}

export default function test_modal() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <DispatchContextProvider>
          <View style={{ flex: 1, paddingTop: 100, backgroundColor: 'green' }}>
            <BottomSheetMenuItem
              id={'1'}
              initState={'enabled'}
              text={'test'}
              // iconName={'2_bars_in_circle'}
              containerStyle={{ height: 56, width: '100%' }}
            />
          </View>
        </DispatchContextProvider>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
