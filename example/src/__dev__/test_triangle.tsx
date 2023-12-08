import * as React from 'react';
import { View } from 'react-native';
import {
  Container,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function MyTriangle() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: 100,
          width: 100,
          backgroundColor: 'green',
          // overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 50,
            borderRightWidth: 50,
            borderBottomWidth: 100,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'red',
          }}
        />
        <View
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'blue',
            borderBottomColor: 'yellow',
            borderLeftWidth: 75,
            borderRightWidth: 75,
            borderBottomWidth: 100,
            borderTopWidth: 0,
            borderRadius: 10,
            transform: [
              { rotate: '-90deg' },
              {
                translateY: 100,
              },
            ],
          }}
        />
        <View
          style={{
            backgroundColor: 'orange',
            width: 200,
            height: 200,
          }}
        >
          <View
            style={{
              backgroundColor: 'green',
              width: 100,
              height: 100,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: [
                { rotate: '0deg' },
                // { translateX: -20 },
                // { translateY: 50 },
              ],
            }}
          />
          <View
            style={{
              position: 'absolute',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              backgroundColor: 'transparent',
              borderBottomColor: 'yellow',
              borderLeftWidth: 75,
              borderRightWidth: 75,
              borderBottomWidth: 100,
              borderTopWidth: 0,
              borderRadius: 10,
              transform: [{ rotate: '-0deg' }],
            }}
          />
        </View>

        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'blue',
            transform: [{ rotate: '45deg' }],
            borderRadius: 10,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export function MyTriangle2() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: 10,
          width: 10,
          alignItems: 'flex-start',
          backgroundColor: 'orange',
          // marginRight: 100,
          // overflow: 'hidden',
        }}
      >
        <View
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'transparent',
            borderBottomColor: 'blue',
            borderLeftWidth: 6.4,
            borderRightWidth: 6.4,
            borderBottomWidth: 8,
            borderTopWidth: 0,
            transform: [{ rotate: '-90deg' }],
          }}
        />
      </View>
      <View
        style={{
          height: 10,
          width: 10,
          alignItems: 'flex-end',
          backgroundColor: 'orange',
          // marginRight: 100,
          // overflow: 'hidden',
        }}
      >
        <View
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            backgroundColor: 'transparent',
            borderBottomColor: 'blue',
            borderLeftWidth: 6.4,
            borderRightWidth: 6.4,
            borderBottomWidth: 8,
            borderTopWidth: 0,
            transform: [{ rotate: '90deg' }],
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default function TestTriangle() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <Container appKey={''} palette={p} theme={t}>
      <MyTriangle2 />
    </Container>
  );
}
