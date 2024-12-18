import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
  useCompare,
} from '../rename.room';

export function TestComponent() {
  return (
    <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
      <Text>{'test use life cycle'}</Text>
    </View>
  );
}

export function TestUseCompare() {
  const isShowRef = React.useRef({
    isShow: false,
  });
  const [isShow, setIsShow] = React.useState(isShowRef.current);

  useCompare(isShow);
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
          isShowRef.current.isShow = !isShowRef.current.isShow;
          setIsShow({ isShow: isShowRef.current.isShow });
        }}
      >
        <Text>{'click me update component'}</Text>
      </TouchableOpacity>
      {isShow.isShow === true ? <TestComponent /> : null}
    </View>
  );
}

export function TestUseCompare2(): JSX.Element {
  const [, setCount] = React.useState(0);
  const cb = React.useCallback(() => {
    setCount((pre) => pre + 1);
  }, []);
  useCompare(cb);
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
          cb();
        }}
      >
        <Text>{'click me invoke callback'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function TestUseCompare3(): JSX.Element {
  const [, setCount] = React.useState(0);
  const cb = () => {
    console.log('test:onPress');
    setCount((pre) => pre + 1);
  };
  useCompare(cb);
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
          cb();
        }}
      >
        <Text>{'click me invoke callback'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function test_use_compare() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TestUseCompare />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
