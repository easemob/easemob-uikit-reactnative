import * as React from 'react';
import { View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  SimpleToast,
  SimpleToastRef,
} from '../rename.room';

let count = 1;

export function TestSimpleComponent(): JSX.Element {
  const propsRef = React.useRef<SimpleToastRef>({} as any);
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <View
        style={{
          height: 100,
          width: 100,
          top: 100,
          backgroundColor: 'yellow',
        }}
        onTouchEnd={() => {
          propsRef.current.show({
            message:
              count % 2 === 0
                ? 'hello world'
                : 'yellow hello world hello world hello world hello world',
            timeout: 1000,
          });
          ++count;
        }}
      />
      <SimpleToast propsRef={propsRef} />
    </View>
  );
}

export default function test_simple_toast() {
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
      <TestSimpleComponent />
    </Container>
  );
}
