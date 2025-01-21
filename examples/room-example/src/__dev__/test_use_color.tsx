import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
  useColors,
  usePaletteContext,
} from '../rename.room';

export function UseColorComponent(): JSX.Element {
  const { colors } = usePaletteContext();
  const { initColor, getColor } = useColors({
    '1': {
      light: colors.error[2],
      dark: colors.neutral[8],
    },
  });

  React.useEffect(() => {
    initColor({
      '1': {
        light: colors.error[2],
        dark: colors.neutral[8],
      },
    });
  }, [colors.error, colors.neutral, initColor]);

  return (
    <View
      style={{ width: 100, height: 100, backgroundColor: getColor('1') }}
      onLayout={() => {
        console.log('test:onLayout:1:');
      }}
    />
  );
}

export function UseColorComponent2(): JSX.Element {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    '2': {
      light: colors.error[5],
      dark: colors.neutral[5],
    },
  });

  return (
    <View
      style={{ width: 100, height: 100, backgroundColor: getColor('2') }}
      onLayout={() => {
        console.log('test:onLayout:2:');
      }}
    />
  );
}

export function TestUseColor() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const [t, setT] = React.useState<'light' | 'dark'>('light');
  return (
    <ThemeContextProvider value={t === 'light' ? light : dark}>
      <PaletteContextProvider value={palette}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={{ height: 100 }}
            onPress={() => {
              setT(t === 'light' ? 'dark' : 'light');
            }}
          >
            <Text>{'change theme'}</Text>
          </TouchableOpacity>
          <UseColorComponent />
          <UseColorComponent2 />
        </View>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}

export default function test_use_color() {
  return <TestUseColor />;
}
