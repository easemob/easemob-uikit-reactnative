import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  ContactSearchModel,
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
        onCancel={(data: ContactSearchModel[]) => {
          if (searchType === 'create-group') {
            navigation.navigate({
              name: 'CreateGroup',
              params: {
                params: {
                  searchType: 'create-group',
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
          } else if (searchType === 'forward-message') {
            navigation.navigate({
              name: 'MessageForwardSelector',
              params: {
                params: {
                  searchType: 'forward-message',
                  data: data ? JSON.stringify(data) : undefined,
                  convId,
                  convType,
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
            // navigation.pop(2);
            navigation.popToTop();
            navigation.navigate('ConversationDetail', {
              params: {
                convId,
                convType,
                convName,
                selectedContacts: JSON.stringify(data),
                operateType: 'share_card',
                from: 'SearchContact',
                hash: Date.now(),
              },
            });
          } else if (searchType === 'new-conversation') {
            if (data) {
              navigation.popToTop(); // go to home
              navigation.navigate('ConversationDetail', {
                params: {
                  convId: data.userId,
                  convType: ChatConversationType.PeerChat,
                  convName: data.userName ?? data.userId,
                  from: 'SearchContact',
                  hash: Date.now(),
                },
              });
            }
          } else if (searchType === 'contact-list') {
            if (data) {
              navigation.navigate('ContactInfo', {
                params: { userId: data.userId },
              });
            }
          } else if (searchType === 'forward-message') {
            if (data) {
              console.log('test:zuoyu:123234:forward', data);
              DeviceEventEmitter.emit('forwardMessage', data);
            }
          }
        }}
        searchType={searchType}
        groupId={groupId}
      />
    </SafeAreaView>
  );
}
