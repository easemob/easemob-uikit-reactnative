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
  useCheckType,
  useGetStyleSize,
} from '../rename.room';

export function TestComponent({
  containerStyle,
}: {
  containerStyle?: StyleProp<ViewStyle> | undefined;
}) {
  const { getViewStyleSize } = useGetStyleSize();
  const size = getViewStyleSize(containerStyle);
  const { checkType } = useCheckType();
  checkType(size.width, 'string');
  return (
    <View
      style={[
        { width: 100, height: 100, backgroundColor: 'red' },
        containerStyle,
      ]}
    >
      <Text>{'I am a striking color block.'}</Text>
    </View>
  );
}

export function TestUseCheckType(): JSX.Element {
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
        <Text>{'click me test component size type'}</Text>
      </TouchableOpacity>
      {isShow === true ? (
        <TestComponent containerStyle={{ width: 110 }} />
      ) : null}
    </View>
  );
}

export default function test_use_object_type() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TestUseCheckType />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
