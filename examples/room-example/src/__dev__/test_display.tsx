import * as React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
} from '../rename.room';

export function DisplayComponent({ style }: { style?: StyleProp<ViewStyle> }) {
  React.useEffect(() => {
    console.log('test:start:');
    return () => {
      console.log('test:end:');
    };
  }, []);
  return (
    <View
      style={[{ width: 300, height: 200, backgroundColor: 'red' }, style]}
    />
  );
}

export function DisplayComponent2({ style }: { style?: StyleProp<ViewStyle> }) {
  React.useEffect(() => {
    console.log('test:start:2:');
    return () => {
      console.log('test:end:2:');
    };
  }, []);
  return (
    <View
      style={[{ width: 300, height: 200, backgroundColor: 'blue' }, style]}
    />
  );
}

export function TestDisplay(): JSX.Element {
  const [display, setDisplay] = React.useState(true);
  return (
    <View>
      <TouchableOpacity
        style={{ height: 60, width: '100%' }}
        onPress={() => {
          setDisplay(!display);
        }}
      >
        <Text>{'test flex display'}</Text>
      </TouchableOpacity>
      <DisplayComponent
        style={{ display: display === true ? 'flex' : 'none' }}
      />
      {display === true ? <DisplayComponent2 /> : null}
    </View>
  );
}

export default function test_display() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <View style={{ flex: 1, backgroundColor: 'green', paddingTop: 100 }}>
          <TestDisplay />
        </View>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
