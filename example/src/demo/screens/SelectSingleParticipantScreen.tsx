import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SelectSingleParticipant } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SelectSingleParticipantScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaViewFragment>
      <SelectSingleParticipant
        groupId={groupId}
        onBack={() => {
          navi.goBack();
        }}
        onClickedItem={(data) => {
          navi.goBack({
            props: {
              selectedParticipants: data,
              operateType: 'mention',
            },
          });
        }}
      />
    </SafeAreaViewFragment>
  );
}
