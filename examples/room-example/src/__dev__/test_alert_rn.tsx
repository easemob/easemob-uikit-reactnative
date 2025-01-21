import * as React from 'react';
import { Alert, View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
} from '../rename.room';

export function TestAlertComponent(): JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <View
        style={{ height: 100, width: 100, backgroundColor: 'yellow' }}
        onTouchEnd={() => {
          Alert.alert('Alert Title', 'My Alert Msg', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }}
      />
      <View
        style={{ height: 100, width: 100, backgroundColor: 'orange' }}
        onTouchEnd={() => {
          Alert.prompt('Alert Title', 'My Alert Msg', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }}
      />
    </View>
  );
}

export default function test_alert_rn() {
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
      <TestAlertComponent />
    </Container>
  );
}
