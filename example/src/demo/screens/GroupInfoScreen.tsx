import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { GroupInfo } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { navigation, route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <GroupInfo
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        onParticipant={(groupId) => {
          navigation.push('GroupParticipantList', { params: { groupId } });
        }}
      />
    </SafeAreaView>
  );
}
