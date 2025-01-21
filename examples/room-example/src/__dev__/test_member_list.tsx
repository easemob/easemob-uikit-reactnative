import * as React from 'react';
import { Platform, Pressable, TouchableOpacity, View } from 'react-native';

import {
  BottomSheetParticipantList,
  BottomSheetParticipantListRef,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  Text,
} from '../rename.room';

/**
 * for test member list.
 */
export function ParticipantListItem(): JSX.Element {
  const ref = React.useRef<BottomSheetParticipantListRef>({} as any);
  return (
    <View style={{ flex: 1 }}>
      <BottomSheetParticipantList ref={ref} />
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
          <Text>{'show member list'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Verify absolute layout.
 */
export function ParticipantListItem2(): JSX.Element {
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
          <BottomSheetParticipantList ref={ref} />
        </View>
      ) : (
        <BottomSheetParticipantList ref={ref} />
      )}
    </View>
  );
}

export default function test_button() {
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
        <ParticipantListItem />
      </View>
    </Container>
  );
}
