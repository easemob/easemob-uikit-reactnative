import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SearchContact, SearchType } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchContactScreen(props: Props) {
  const { navigation, route } = props;
  const searchType = ((route.params as any)?.params as any)
    ?.searchType as SearchType;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <SearchContact
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onCancel={(data) => {
          if (searchType === 'create-group') {
            navigation.navigate({
              name: 'CreateGroup',
              params: {
                params: {
                  searchType: 'create-group',
                  groupId,
                  data: data ? JSON.stringify(data) : undefined,
                },
              },
              merge: true,
            });
          } else if (searchType === 'add-group-member') {
            navigation.navigate({
              name: 'AddGroupParticipant',
              params: {
                params: {
                  searchType: 'add-group-member',
                  groupId,
                  data: data ? JSON.stringify(data) : undefined,
                },
              },
              merge: true,
            });
          } else {
            navigation.goBack();
          }
        }}
        searchType={searchType}
        groupId={groupId}
      />
    </SafeAreaView>
  );
}