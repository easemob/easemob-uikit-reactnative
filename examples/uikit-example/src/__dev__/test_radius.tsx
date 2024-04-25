import * as React from 'react';
import { View } from 'react-native';
import {
  CmnButton,
  Container,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test1() {
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'alert'}
        onPress={() => {}}
      />
      <View
        style={{
          height: 100,
          width: 100,
          borderRadius: 10,
          borderWidth: 1,
          borderBottomColor: 'red',
          borderBottomEndRadius: 20,
          borderBottomStartRadius: 20,
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
        }}
      />
    </SafeAreaView>
  );
}

export default function TestRadius() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test1 />
    </Container>
  );
}
