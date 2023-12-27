import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ContactList,
  DataModel,
  UIKitError,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactListScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactList
        contactType={'contact-list'}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onRequestData={(params: {
          ids: string[];
          result: (data?: DataModel[], error?: UIKitError) => void;
        }) => {
          const userIds = params.ids;
          const users = userIds.map((v) => {
            return {
              id: v,
              name: v + 'name',
              avatar:
                'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            };
          });
          params.result(users ?? []);
        }}
        onSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'contact-list' },
          });
        }}
        onClicked={(data) => {
          if (data?.userId) {
            navigation.push('ContactInfo', { params: { userId: data.userId } });
          }
        }}
        onClickedGroupList={() => {
          navigation.navigate('GroupList', {
            params: {},
          });
        }}
        onClickedNewRequest={() => {
          navigation.navigate('NewRequests', {
            params: {},
          });
        }}
        // onClickedNewContact={() => {}}
      />
    </SafeAreaView>
  );
}
