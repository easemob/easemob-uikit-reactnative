import * as React from 'react';
import {
  Animated,
  ColorValue,
  StyleProp,
  Switch as RNSwitch,
  View,
  ViewStyle,
} from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  Switch,
} from '../rename.room';

export function Switch1() {
  const [value, setValue] = React.useState(false);
  return (
    <RNSwitch
      thumbColor={'red'}
      trackColor={{
        false: 'yellow', // !!! invalid color
        true: 'orange',
      }}
      value={value}
      onValueChange={setValue}
      style={{
        width: 100,
        height: 40,
        backgroundColor: 'blue',
      }}
    />
  );
}

export function TestMySwitch() {
  const [value, setValue] = React.useState(false);
  return (
    <MySwitch
      thumbColor={'red'}
      // trackColor={{
      //   false: 'rgba(20,20,20,1)', // !!! invalid color
      //   true: 'rgba(200,200,200,1)',
      // }}
      value={value}
      onValueChange={setValue}
      style={
        {
          // width: 35,
          // height: 20,
          // backgroundColor: 'blue',
        }
      }
      height={20}
      // width={35}
      // disabled={true}
    />
  );
}

export function TestRoomSwitch() {
  const [value, setValue] = React.useState(false);
  return (
    <Switch
      // thumbColor={'red'}
      // thumbBackgroundColor={'orange'}
      // trackColor={{
      //   false: 'rgba(20,20,20,1)', // !!! invalid color
      //   true: 'rgba(200,200,200,1)',
      // }}
      value={value}
      onValueChange={setValue}
      style={
        {
          // width: 35,
          // height: 20,
          // backgroundColor: 'blue',
        }
      }
      // height={20}
      // width={35}
      // disabled={true}
      trackIcon={{ false: 'airplane', true: 'agora_dollar' }}
    />
  );
}

export interface MySwitchProps {
  height?: number | undefined;
  width?: number | undefined;
  /**
   * Color of the foreground switch grip.
   */
  thumbColor?: ColorValue | undefined;

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

  style?: StyleProp<ViewStyle> | undefined;
}

function useMySwitchAnimation(params: {
  value: boolean;
  width: number;
  height: number;
  falseColor: string;
  trueColor: string;
}) {
  console.log('test:zuoyu:MySwitch:useMySwitchAnimation:params', params);
  const { height, width, value, falseColor, trueColor } = params;
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
      duration: 250,
      useNativeDriver: true,
    }),
    Animated.timing(trackColorNumber, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }),
  ]).start;
  const toLeft = Animated.parallel([
    Animated.timing(translateX, {
      toValue: marginLeft.current,
      duration: 250,
      useNativeDriver: true,
    }),
    Animated.timing(trackColorNumber, {
      toValue: 0,
      duration: 250,
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
export function MySwitch(props: MySwitchProps) {
  const {
    style,
    height: propsHeight,
    width: propsWidth,
    value: propsValue,
    onValueChange,
    disabled,
    thumbColor = 'white',
    trackColor: propsTrackColor,
  } = props;
  const height = propsHeight ?? 40;
  const width = propsWidth ?? height * (70 / 40);
  const _value = propsValue ?? false;
  const falseColor = (propsTrackColor?.false ?? 'rgba(1,2,3,1)') as 'string';
  const trueColor = (propsTrackColor?.true ??
    'rgba(200,200,200,1)') as 'string';
  const { translateX, toRight, toLeft, trackColor } = useMySwitchAnimation({
    value: _value,
    width,
    height,
    falseColor,
    trueColor,
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
        },
      ]}
      onTouchEnd={() => {
        if (disabled === true) {
          return;
        }
        console.log('test:zuoyu:onTouchEnd:', _value);
        _onValueChange(!_value);
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateX: translateX }],
          height: height * 0.9,
          width: height * 0.9,
          borderRadius: width * 0.9,
          backgroundColor: thumbColor,
        }}
      >
        <View />
      </Animated.View>
    </Animated.View>
  );
}

export default function TestSwitch() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      isDevMode={true}
      palette={palette}
      theme={theme}
    >
      <View
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: 'white',
        }}
      >
        <Switch1 />
        <TestMySwitch />
        <TestRoomSwitch />
      </View>
    </Container>
  );
}
