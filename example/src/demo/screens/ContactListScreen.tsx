import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ContactList, DataModel, UIKitError } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactListScreen(props: Props) {
  const { navigation } = props;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
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
        onNewGroup={() => {
          navigation.navigate('CreateGroup', {
            params: { searchType: 'create-group' },
          });
        }}
        onNewConversation={() => {
          navigation.navigate('NewConversation', {
            params: { searchType: 'new-conversation' },
          });
        }}
      />
    </SafeAreaView>
  );
}
