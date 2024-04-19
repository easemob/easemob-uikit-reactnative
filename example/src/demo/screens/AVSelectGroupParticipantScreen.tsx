import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { AVSelectGroupParticipant } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AVSelectGroupParticipantScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const groupId = ((route.params as any)?.params as any)?.groupId;

  return (
    <SafeAreaViewFragment>
      <AVSelectGroupParticipant
        groupId={groupId}
        onBack={() => {
          navi.goBack();
        }}
        onSelectResult={(data) => {
          navi.goBack({
            props: {
              selectedMembers: data,
            },
          });
        }}
      />
    </SafeAreaViewFragment>
  );
}
