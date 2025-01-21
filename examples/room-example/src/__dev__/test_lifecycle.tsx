import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  useCompare,
  useLifecycle,
} from '../rename.room';

export function TestComponent() {
  const cb = (state: any) => {
    console.log('test:TestComponent:useLifecycle:', state);
  };
  useLifecycle(cb);
  useCompare(cb);
  return (
    <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
      <Text>{'test use life cycle'}</Text>
    </View>
  );
}

export function TestComponent2() {
  const cb = React.useCallback((state) => {
    console.log('test:TestComponent2:useLifecycle:', state);
  }, []);
  useLifecycle(cb);
  useCompare(cb);
  return (
    <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
      <Text>{'test use life cycle'}</Text>
    </View>
  );
}

export function TestUseLifecycle(): JSX.Element {
  const [isShow, setIsShow] = React.useState(false);
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
        backgroundColor: 'green',
      }}
    >
      <TouchableOpacity
        style={{ width: '100%', height: 60, backgroundColor: 'yellow' }}
        onPress={() => {
          setIsShow(!isShow);
        }}
      >
        <Text>{'click me change visible'}</Text>
      </TouchableOpacity>
      {isShow === true ? <TestComponent /> : null}
    </View>
  );
}

export default function test_use_lifecycle() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container opt={{ appKey: 'sdf' } as any} palette={palette} theme={theme}>
      <TestUseLifecycle />
    </Container>
  );
}
