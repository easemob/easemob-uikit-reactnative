import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  IconButton,
  PaletteContextProvider,
  ThemeContextProvider,
} from '../rename.room';

export function TestShadow(): JSX.Element {
  const getShadow = (): StyleProp<ViewStyle> => {
    return {
      shadowColor: 'red',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    };
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'green',
      }}
    >
      <IconButton
        onPress={() => {
          console.log('test:ButtonComponent:onPress:');
        }}
        iconName={'link'}
        style={{ width: 100, height: 100 }}
        containerStyle={[
          { backgroundColor: 'yellow', borderRadius: 20 },
          getShadow(),
        ]}
      />
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
