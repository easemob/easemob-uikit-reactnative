import * as React from 'react';
import { Text as RNText, View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  Text,
  ThemeContextProvider,
} from '../rename.room';

export function TextComponent(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
      }}
    >
      <Text
        textType={'large'}
        paletteType={'headline'}
        onTextLayout={(e) => {
          console.log('test:onTextLayout:', e.nativeEvent.lines);
        }}
        onLayout={(e) => {
          console.log('test:onLayout:', e.nativeEvent.layout);
        }}
      >
        headline - large
      </Text>
    </View>
  );
}

export function TextComponent2(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
      }}
    >
      <View
        style={{
          backgroundColor: 'blue',
        }}
      >
        <Text
          textType={'large'}
          paletteType={'headline'}
          style={{ fontSize: 40 }}
        >
          headline - large
        </Text>
      </View>
      <RNText
        style={[
          {
            fontFamily: undefined,
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
          },
          { fontSize: 40 },
        ]}
      >
        RN headline - large
      </RNText>
    </View>
  );
}

export default function test_text() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? dark : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TextComponent2 />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
