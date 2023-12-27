import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  SearchContact,
  SearchType,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchContactScreen(props: Props) {
  const { navigation, route } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const searchType = ((route.params as any)?.params as any)
    ?.searchType as SearchType;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convName = ((route.params as any)?.params as any)?.convName;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
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
        onClicked={(data) => {
          if (searchType === 'share-contact') {
            // todo: go back 2 times
            // navigation.pop(2);
            navigation.navigate('ConversationDetail', {
              params: {
                convId,
                convType,
                convName,
                selectedContacts: JSON.stringify(data),
                operateType: 'share_card',
              },
            });
          }
        }}
        searchType={searchType}
        groupId={groupId}
      />
    </SafeAreaView>
  );
}
