import * as React from 'react';
import { Platform, Pressable, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetMessageReport,
  BottomSheetParticipantListRef,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  SimulativeModalRef,
  Text,
} from '../rename.room';

// const data = [
//   {
//     id: seqId('_rp').toString(),
//     title: 'Unwelcome commercial content',
//     checked: true,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Pornographic or explicit content',
//     checked: false,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Child abuse',
//     checked: false,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Child abuse 2',
//     checked: false,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Child abuse 3',
//     checked: false,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Hate speech or graphic violence',
//     checked: false,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Promote terrorism',
//     checked: false,
//   },
//   {
//     id: seqId('_rp').toString(),
//     title: 'Harassment or bullying',
//     checked: false,
//   },
// ];

/**
 * for test report list.
 */
export function TestReport() {
  const ref = React.useRef<SimulativeModalRef>({} as any);
  return (
    <View style={{ flex: 1 }}>
      <BottomSheetMessageReport ref={ref} data={[]} onReport={() => {}} />
      <View
        style={{
          position: 'absolute', // !!! must
          marginTop: 100,
          height: 60,
          width: 300,
          backgroundColor: 'red',
          // padding: 10,
        }}
      >
        <Pressable
          style={{ height: 60, width: 300, backgroundColor: 'white' }}
          onPress={() => {
            ref.current?.startShow();
          }}
        >
          <Text>{'show report list'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Verify absolute layout.
 */
export function TestReport2(): JSX.Element {
  const ref = React.useRef<BottomSheetParticipantListRef>({} as any);
  return (
    <View style={{ flex: 1, top: 100 }}>
      <TouchableOpacity
        style={{ height: 60, backgroundColor: 'white' }}
        onPress={() => {
          ref.current?.startShow();
        }}
      >
        <Text>{'show member list'}</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <View style={{ position: 'absolute' }}>
          <BottomSheetMessageReport ref={ref} data={[]} onReport={() => {}} />
        </View>
      ) : (
        <BottomSheetMessageReport ref={ref} data={[]} onReport={() => {}} />
      )}
    </View>
  );
}

export default function test_report() {
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
        <TestReport />
      </View>
    </Container>
  );
}
