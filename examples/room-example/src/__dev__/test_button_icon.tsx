import * as React from 'react';
import { View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  IconButton,
  IconNameType,
  PaletteContextProvider,
  ThemeContextProvider,
} from '../rename.room';

export function IconButtonComponent(): JSX.Element {
  const [iconName, setIconName] = React.useState<IconNameType>('link');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <IconButton
        iconName={iconName}
        style={{ width: 40, height: 40 }}
        containerStyle={{ backgroundColor: 'blue' }}
        onPress={() => {
          setIconName(iconName === 'link' ? '3vertical_in_house' : 'link');
        }}
      />
    </View>
  );
}

export default function test_icon_button() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <IconButtonComponent />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
