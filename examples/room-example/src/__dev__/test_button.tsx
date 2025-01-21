import * as React from 'react';
import { View } from 'react-native';

import {
  BorderIconButton,
  Button,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  Text1IconButton,
  ThemeContextProvider,
} from '../rename.room';

export function ButtonComponent(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        buttonStyle={'commonButton'}
        sizesType={'large'}
        radiusType={'large'}
        contentType={'icon-text'}
        text={'Enabled'}
        icon={'keyboard'}
        onPress={() => {
          console.log('test:ButtonComponent:onPress:');
        }}
      />
    </View>
  );
}

export function IconButtonComponent(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text1IconButton
        sizesType={'large'}
        radiusType={'large'}
        icon={'keyboard'}
        onPress={() => {
          console.log('test:ButtonComponent:onPress:');
        }}
      />
    </View>
  );
}

export function IconButtonComponent2(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BorderIconButton
        sizesType={'large'}
        radiusType={'large'}
        icon={'keyboard'}
        onPress={() => {
          console.log('test:ButtonComponent:onPress:');
        }}
      />
    </View>
  );
}

export default function test_button() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <IconButtonComponent2 />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
