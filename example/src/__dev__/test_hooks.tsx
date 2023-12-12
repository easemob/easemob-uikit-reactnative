import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CmnButton,
  getPropValueFromStyleT,
  GlobalContainer,
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
        text={'test'}
        onPress={() => {
          console.log(
            'test:zuoyu:',
            getPropValueFromStyleT(styles.test1, 'display')
          );
          console.log(
            'test:zuoyu:',
            getPropValueFromStyleT(
              [styles.test1, styles.test2],
              'backgroundColor'
            )
          );
        }}
      />
      <View style={styles.test1} />
      <View style={[styles.test1, styles.test2]} />
    </SafeAreaView>
  );
}

export default function TestHooks() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <GlobalContainer appKey={''} palette={p} theme={t}>
      <Test1 />
    </GlobalContainer>
  );
}

const styles = StyleSheet.create({
  test1: {
    backgroundColor: 'red',
    height: 100,
    width: 100,
    display: 'flex',
  },
  test2: {
    backgroundColor: 'blue',
  },
});
