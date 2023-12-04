import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { GroupParticipantInfo } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantInfoScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const userId = ((route.params as any)?.params as any)?.userId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <GroupParticipantInfo
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        userId={userId}
      />
    </SafeAreaView>
  );
}
