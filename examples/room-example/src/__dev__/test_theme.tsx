import * as React from 'react';
import { View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
  usePaletteContext,
  useThemeContext,
} from '../rename.room';

function UseThemeComponent(): JSX.Element {
  const theme = useThemeContext();
  const palette = usePaletteContext();
  const printTheme = () => {
    console.log('test:theme:', JSON.stringify(theme));
    console.log('test:palette:', JSON.stringify(palette));
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{ height: 100, width: 100, backgroundColor: 'blue' }}
        onTouchEnd={printTheme}
      />
    </View>
  );
}

export default function test_theme() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? dark : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <UseThemeComponent />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
