import * as React from 'react';
import {
  Animated,
  Pressable,
  Text,
  // TouchableNativeFeedback,
  // TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  GlobalContainer,
  Ripple,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test() {
  const timestamp = React.useRef(1000).current;
  const opacity = React.useRef(new Animated.Value(0.5)).current;
  const scale = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(opacity, {
          useNativeDriver: false,
          toValue: 0,
          duration: timestamp,
        }),
        Animated.timing(scale, {
          useNativeDriver: false,
          toValue: 1,
          duration: timestamp,
        }),
      ])
    ).start();
  }, [opacity, scale, timestamp]);
  const height = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 120],
  });
  const width = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 220],
  });
  const borderRadius = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [50, (220 / 200) * 50],
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
      }}
    >
      <SafeAreaView
        style={{
          flexGrow: 1,
        }}
      >
        <View
          style={{
            // height: 300,
            // width: 100,
            // height: '100%',
            backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={{
              height: height,
              width: width,
              opacity: opacity,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00bfff',
              borderRadius: borderRadius,
              // overflow: 'hidden',
              position: 'absolute',
            }}
          />
          <Text
            style={{
              height: 100,
              width: 200,
              backgroundColor: '#00bfff',
              opacity: 1,
              borderRadius: 50,
            }}
          >
            {'test ripple'}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export function Test2() {
  const [playAnimated, setPlayAnimated] = React.useState<boolean>(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
      }}
    >
      <SafeAreaView
        style={{
          flexGrow: 1,
        }}
      >
        <Pressable
          onPress={() => {
            setPlayAnimated((v) => !v);
          }}
          style={{ height: 50, width: 100, backgroundColor: 'green' }}
        >
          <Text>{'test ripple'}</Text>
        </Pressable>
        <Ripple
          containerStyle={{
            height: 120,
            width: 220,
          }}
          childrenStyle={{
            height: 100,
            width: 200,
            borderRadius: 50,
          }}
          rippleStyle={{
            height: 120,
            width: 220,
            backgroundColor: 'blue',
          }}
          playAnimated={playAnimated}
        >
          <Text
            style={{
              height: 100,
              width: 200,
              backgroundColor: '#00bfff',
              opacity: 1,
              borderRadius: 50,
            }}
          >
            {'test ripple'}
          </Text>
        </Ripple>
      </SafeAreaView>
    </View>
  );
}

export default function TestRippleButton() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <GlobalContainer
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test2 />
    </GlobalContainer>
  );
}
