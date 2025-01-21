import * as React from 'react';
import { NativeModules, Platform, View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
} from '../rename.room';

const getSystemLanguage = () => {
  if (Platform.OS === 'ios') {
    return NativeModules.SettingsManager.settings.AppleLocale;
  } else if (Platform.OS === 'android') {
    return NativeModules.I18nManager?.localeIdentifier;
  }
};

export function Component(): JSX.Element {
  return (
    <View
      style={{
        width: 100,
        height: 100,
        backgroundColor: 'yellow',
        top: 100,
      }}
      onTouchEnd={() => {
        const systemLanguage = getSystemLanguage();
        console.log('test:zuoyu:', systemLanguage);
      }}
    />
  );
}

export default function test_local_language() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      isDevMode={true}
      palette={palette}
      theme={theme}
    >
      <View
        style={{
          flex: 1,
          // paddingTop: 100,
          backgroundColor: 'green',
        }}
      >
        <Component />
      </View>
    </Container>
  );
}
