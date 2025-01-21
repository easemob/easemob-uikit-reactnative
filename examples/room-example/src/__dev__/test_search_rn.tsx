import * as React from 'react';
import { View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  Icon,
  PaletteContextProvider,
  Text1Button,
  TextInput,
  ThemeContextProvider,
  usePaletteContext,
  useThemeContext,
} from '../rename.room';

export function TestSearchComponent(): JSX.Element {
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
        backgroundColor: 'yellow',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor:
            style === 'light' ? colors.neutral[98] : colors.neutral[1],
          paddingLeft: 16,
          paddingRight: 8,
        }}
      >
        <View
          style={{
            height: 44,
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <TextInput
            containerStyle={{
              backgroundColor:
                style === 'light' ? colors.neutral[95] : colors.neutral[2],
              justifyContent: 'center',
              borderRadius: 18,
              height: 36,
            }}
            style={{
              paddingLeft: 35,
              color: style === 'light' ? colors.neutral[5] : colors.neutral[5],
            }}
          />
          <Icon
            name={'magnifier'}
            style={{
              position: 'absolute',
              left: 8,
              width: 22,
              height: 22,
              tintColor:
                style === 'light' ? colors.neutral[5] : colors.neutral[5],
            }}
          />
        </View>
        <Text1Button
          sizesType={'middle'}
          radiusType={'large'}
          contentType={'only-text'}
          text={'Cancel'}
        />
      </View>
    </View>
  );
}

export default function test_search() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TestSearchComponent />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
