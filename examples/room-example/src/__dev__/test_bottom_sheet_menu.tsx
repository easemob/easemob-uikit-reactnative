import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  BottomSheetMenu,
  BottomSheetMenuItem,
  BottomSheetMenuRef,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  useColors,
  usePaletteContext,
} from '../rename.room';

export function TestBottomSheetMenu() {
  const ref = React.useRef<BottomSheetMenuRef>({} as any);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const data = React.useMemo(
    () => [
      <BottomSheetMenuItem
        key={0}
        id={'1'}
        initState={'enabled'}
        text={'Private Chat'}
      />,
      <BottomSheetMenuItem
        key={1}
        id={'2'}
        initState={'enabled'}
        text={'Translate'}
      />,
      <BottomSheetMenuItem
        key={2}
        id={'3'}
        initState={'enabled'}
        text={'Deleted'}
      />,
      <BottomSheetMenuItem
        key={3}
        id={'4'}
        initState={'enabled'}
        text={'Muted'}
      />,
      <BottomSheetMenuItem
        key={4}
        id={'5'}
        initState={'warned'}
        text={'Report'}
      />,
      <View
        key={6}
        style={{
          height: 8,
          width: '100%',
          backgroundColor: getColor('divider'),
        }}
      />,
      <BottomSheetMenuItem
        key={5}
        id={'6'}
        initState={'enabled'}
        text={'Cancel'}
      />,
    ],
    [getColor]
  );
  const data2 = React.useMemo(() => data.slice(1, data.length), [data]);
  const count = React.useRef(0);
  return (
    <View>
      <BottomSheetMenu
        ref={ref}
        onRequestModalClose={() => {
          ref.current.startHide();
        }}
        title={
          'Nickname: Sei la cosa più bella che mia sia mai capitato non so stare senza te.'
        }
        initItems={data}
      />
      <View style={{ position: 'absolute', paddingTop: 50 }}>
        <Pressable
          style={{ height: 60, backgroundColor: 'yellow' }}
          onPress={() => {
            // ref.current?.startShow?.();
            ref.current?.startShowWithInit?.(
              count.current % 2 === 0 ? data : data2
            );
            // ++count.current;
          }}
        >
          <Text>{'show bottom sheet menu'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function test_bottom_sheet_menu() {
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);
  const light = createLightTheme(pal);
  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      isDevMode={true}
      palette={pal}
      theme={light ? light : dark}
    >
      <TestBottomSheetMenu />
    </Container>
  );
}
