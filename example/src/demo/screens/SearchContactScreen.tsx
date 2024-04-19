import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  ContactSearchModel,
  SearchContact,
  SearchType,
} from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchContactScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const searchType = ((route.params as any)?.params as any)
    ?.searchType as SearchType;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convName = ((route.params as any)?.params as any)?.convName;
  return (
    <SafeAreaViewFragment>
      <SearchContact
        onCancel={(data: ContactSearchModel[]) => {
          if (searchType === 'create-group') {
            navi.navigate({
              to: 'CreateGroup',
              props: {
                searchType: 'create-group',
                data: data ?? undefined,
              },
            });
          } else if (searchType === 'add-group-member') {
            navi.navigate({
              to: 'AddGroupParticipant',
              props: {
                searchType: 'add-group-member',
                groupId,
                data: data ?? undefined,
              },
            });
          } else if (searchType === 'forward-message') {
            navi.navigate({
              to: 'MessageForwardSelector',
              props: {
                searchType: 'forward-message',
                data: data ?? undefined,
                convId,
                convType,
              },
            });
          } else {
            navi.goBack();
          }
        }}
        onClicked={(data) => {
          if (searchType === 'share-contact') {
            navi.navigation.popToTop();
            navi.navigate({
              to: 'ConversationDetail',
              props: {
                convId,
                convType,
                convName,
                selectedContacts: data,
              },
            });
          } else if (searchType === 'new-conversation') {
            if (data) {
              navi.navigation.popToTop();
              navi.navigate({
                to: 'ConversationDetail',
                props: {
                  convId: data.userId,
                  convType: ChatConversationType.PeerChat,
                  convName: data.userName ?? data.userId,
                },
              });
            }
          } else if (searchType === 'contact-list') {
            if (data) {
              navi.navigate({
                to: 'ContactInfo',
                props: {
                  userId: data.userId,
                },
              });
            }
          } else if (searchType === 'forward-message') {
            if (data) {
              DeviceEventEmitter.emit('forwardMessage', data);
            }
          }
        }}
        searchType={searchType}
        groupId={groupId}
      />
    </SafeAreaViewFragment>
  );
}
