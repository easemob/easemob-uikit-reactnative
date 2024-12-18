import * as React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import {
  Avatar,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  Icon,
  IconButton,
  PaletteContextProvider,
  Text,
  ThemeContextProvider,
} from '../rename.room';

type ParticipantListItemProps = { id: string };

export function ParticipantList() {
  const dataRef = React.useRef<ParticipantListItemProps[]>([
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
  ]);
  const [data] = React.useState<ParticipantListItemProps[]>(dataRef.current);

  return (
    <View style={{ height: 300 }}>
      <FlatList
        data={data}
        renderItem={(info: ListRenderItemInfo<ParticipantListItemProps>) => {
          const { item } = info;
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 10,
                // width: '100%',
                // height: 100,
              }}
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
                <Avatar url={'https://note?'} size={40} borderRadius={40} />
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
                  style={{
                    tintColor: undefined,
                    width: 24,
                    height: 24,
                    margin: 4,
                  }}
                />
              </View>
            </View>
          );
        }}
        keyExtractor={(item: ParticipantListItemProps) => {
          return item.id;
        }}
        onResponderEnd={() => {
          console.log('test:zuoyu:request:2:');
        }}
        onResponderReject={() => {
          console.log('test:onResponderReject');
        }}
        onResponderGrant={() => {
          console.log('test:onResponderGrant');
        }}
        onResponderRelease={() => {
          console.log('test:onResponderRelease');
        }}
      />
    </View>
  );
}

export function ParticipantListItem(): JSX.Element {
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '100%',
        flex: 1, // !!! just it.
      }}
    >
      <View style={{ position: 'absolute' }}>
        <View style={{ height: 320, width: 300, flexGrow: 1 }}>
          <ParticipantList />
        </View>
      </View>
    </View>
  );
}

export default function test_flatlist() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <View
          style={{
            flex: 1,
            paddingTop: 100,
            backgroundColor: 'green',
            width: '100%',
          }}
        >
          <ParticipantListItem />
        </View>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
