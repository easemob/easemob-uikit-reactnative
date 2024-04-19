import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { GroupParticipantList } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaViewFragment>
      <GroupParticipantList
        groupId={groupId}
        onClickedSearch={() => {
          navi.push({ to: 'GroupParticipantList' });
        }}
        onClickedItem={(data) => {
          if (data) {
            navi.navigate({
              to: 'ContactInfo',
              props: {
                userId: data.memberId,
              },
            });
          }
        }}
        onClickedAddParticipant={() => {
          navi.push({ to: 'AddGroupParticipant', props: { groupId } });
        }}
        onClickedDelParticipant={() => {
          navi.push({ to: 'DelGroupParticipant', props: { groupId } });
        }}
        onBack={() => {
          navi.goBack();
        }}
        onKicked={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
