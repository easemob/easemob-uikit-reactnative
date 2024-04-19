import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';
import { GroupParticipantInfo } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantInfoScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const userId = ((route.params as any)?.params as any)?.userId;
  return (
    <SafeAreaViewFragment>
      <GroupParticipantInfo
        groupId={groupId}
        userId={userId}
        onSendMessage={(data) => {
          if (data) {
            navi.navigate({
              to: 'ConversationDetail',
              props: {
                convId: data,
                convType: ChatConversationType.PeerChat,
                convName: data,
              },
            });
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
