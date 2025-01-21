import * as React from 'react';
import { View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  SearchParticipant,
} from '../rename.room';

export function SearchParticipantComponent(): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <SearchParticipant
        memberType={'member'}
        onRequestClose={function (): void {
          console.log('test:onRequestClose');
        }}
      />
    </View>
  );
}

export default function test_member_search() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container opt={{ appKey: 'sdf' } as any} palette={palette} theme={theme}>
      <SearchParticipantComponent />
    </Container>
  );
}
