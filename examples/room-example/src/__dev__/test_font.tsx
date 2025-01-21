import { useFonts } from 'expo-font';
import * as React from 'react';
import { Text, View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  useConfigContext,
} from '../rename.room';

export function MyFont(): JSX.Element {
  const { fontFamily } = useConfigContext();
  console.log('test:zuoyu:use:fontFamily:', fontFamily);
  return (
    <View style={{ flex: 1, top: 100 }}>
      <Text
        style={{
          fontFamily: fontFamily,
          fontSize: 50,
        }}
      >
        {'hello中文简体繁体🙄🤐🙄😭😐😐😭😐😭😐😭🙁🙁😭🙁😭😭'}
      </Text>
    </View>
  );
}

export default function TestFont() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? dark : dark;
  const fontFamily = 'Twemoji-Mozilla';
  const [fontsLoaded, error] = useFonts({
    [fontFamily]: require('../../assets/twemoji.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  console.log('test:zuoyu:font:', error);
  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      isDevMode={true}
      palette={palette}
      theme={theme}
      fontFamily={fontFamily}
    >
      <MyFont />
    </Container>
  );
}
