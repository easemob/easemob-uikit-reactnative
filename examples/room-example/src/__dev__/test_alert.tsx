import * as React from 'react';
import { View } from 'react-native';

import {
  Alert,
  AlertRef,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
} from '../rename.room';

export function TestAlertComponent(): JSX.Element {
  const ref = React.useRef<AlertRef>({} as any);
  const ref2 = React.useRef<AlertRef>({} as any);
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <View
        style={{ height: 100, width: 100, backgroundColor: 'yellow' }}
        onTouchEnd={() => {
          ref.current.alert();
        }}
      />
      <View
        style={{ height: 100, width: 100, backgroundColor: 'orange' }}
        onTouchEnd={() => {
          ref2.current?.alert?.();
        }}
      />
      <Alert
        ref={ref2}
        title="test title"
        message="test message"
        buttons={[
          {
            text: 'Cancel',
            onPress: (v) => {
              console.log('test:v:', v);
              ref2.current?.close?.();
            },
          },
          {
            text: 'Confirm',
            onPress: (v) => {
              console.log('test:v:', v);
              ref2.current?.close?.();
            },
          },
          // {
          //   text: 'test',
          //   onPress: () => {
          //     // !!! The Android platform supports nested modal components, but iOS does not.
          //     ref.current.alert();
          //   },
          // },
        ]}
        // supportInput={true}
      />
      <Alert ref={ref} title="test title" message="test message" />
    </View>
  );
}

export default function test_alert_rn() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? dark : dark;
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
