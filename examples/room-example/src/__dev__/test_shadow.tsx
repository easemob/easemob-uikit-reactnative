import * as React from 'react';
import { View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
  useThemeContext,
} from '../rename.room';

const gWidth = 70;

export function TestShadow(): JSX.Element {
  const { shadow } = useThemeContext();
  return (
    <View
      style={{
        paddingTop: 100,
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'stretch',
        backgroundColor: '#00ffff',
      }}
    >
      <View
        style={
          shadow.style.small[1] //
        }
      >
        <View
          style={[
            {
              width: gWidth,
              height: gWidth,
              backgroundColor: 'yellow',
              borderRadius: 20,
            },
            shadow.style.small[0],
          ]}
        />
      </View>
      <View
        style={
          shadow.style.middle[1] //
        }
      >
        <View
          style={[
            {
              width: gWidth,
              height: gWidth,
              backgroundColor: 'yellow',
              borderRadius: 20,
            },
            shadow.style.middle[0],
          ]}
        />
      </View>
      <View
        style={
          shadow.style.large[1] //
        }
      >
        <View
          style={[
            {
              width: gWidth,
              height: gWidth,
              backgroundColor: 'yellow',
              borderRadius: 20,
            },
            shadow.style.large[0],
          ]}
        />
      </View>
      <View>
        <View
          style={[
            {
              width: gWidth,
              height: gWidth,
              backgroundColor: 'yellow',
              borderRadius: 20,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function test_shadow() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TestShadow />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
