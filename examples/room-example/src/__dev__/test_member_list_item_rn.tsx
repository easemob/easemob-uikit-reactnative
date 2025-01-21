import * as React from 'react';
import { View } from 'react-native';

import {
  Avatar,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  Icon,
  IconButton,
  Text,
} from '../rename.room';

export function ParticipantListItem(): JSX.Element {
  return (
    <View
      style={{ backgroundColor: 'white', paddingHorizontal: 10, width: '100%' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name={'crown1'}
          style={{
            width: 22,
            height: 22,
            tintColor: 'orange',
            margin: 4,
          }}
        />

        <View style={{ width: 12 }} />
        <Avatar
          url={
            'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg?w=272&h=272'
          }
          size={40}
          // borderRadius={4}
        />
        <View style={{ width: 12 }} />
        <View style={{ marginVertical: 10 }}>
          <Text textType={'medium'} paletteType={'title'}>
            {'NickName'}
          </Text>
          <Text textType={'medium'} paletteType={'body'}>
            {'Role'}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <IconButton
          iconName={'ellipsis_vertical'}
          style={{ tintColor: undefined, width: 24, height: 24, margin: 4 }}
        />
      </View>
    </View>
  );
}

export default function test_button() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container opt={{ appKey: 'sdf' } as any} palette={palette} theme={theme}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 100,
          backgroundColor: 'green',
        }}
      >
        <ParticipantListItem />
      </View>
    </Container>
  );
}
