import * as React from 'react';
import { View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  Text,
  ThemeContextProvider,
} from '../rename.room';

function TextComponent(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text textType={'large'} paletteType={'headline'}>
        headline - large
      </Text>
      <Text textType={'medium'} paletteType={'headline'}>
        headline - medium
      </Text>
      <Text textType={'small'} paletteType={'headline'}>
        headline - small
      </Text>
      <Text textType={'extraSmall'} paletteType={'headline'}>
        headline - extraSmall
      </Text>

      <Text textType={'large'} paletteType={'title'}>
        title - large
      </Text>
      <Text textType={'medium'} paletteType={'title'}>
        title - medium
      </Text>
      <Text textType={'small'} paletteType={'title'}>
        title - small
      </Text>
      <Text textType={'extraSmall'} paletteType={'title'}>
        title - extraSmall
      </Text>

      <Text textType={'large'} paletteType={'label'}>
        label - large
      </Text>
      <Text textType={'medium'} paletteType={'label'}>
        label - medium
      </Text>
      <Text textType={'small'} paletteType={'label'}>
        label - small
      </Text>
      <Text textType={'extraSmall'} paletteType={'label'}>
        label - extraSmall
      </Text>

      <Text textType={'large'} paletteType={'body'}>
        body - large
      </Text>
      <Text textType={'medium'} paletteType={'body'}>
        body - medium
      </Text>
      <Text textType={'small'} paletteType={'body'}>
        body - small
      </Text>
      <Text textType={'extraSmall'} paletteType={'body'}>
        body - extraSmall
      </Text>
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
        <TextComponent />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
