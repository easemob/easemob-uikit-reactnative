import * as React from 'react';
import { Linking } from 'react-native';
import {
  CmnButton,
  Container,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test1() {
  const test = () => {
    Linking.canOpenURL(
      'https://mp.weixin.qq.com/s/gHwEiOTm_vId1ja26zUwCw'
    ).then((supported) => {
      console.log('test:zuoyu:supported:', supported);
    });
  };
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'alert'}
        onPress={() => {
          test();
        }}
      />
    </SafeAreaView>
  );
}

export default function TestOpenUrl() {
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
