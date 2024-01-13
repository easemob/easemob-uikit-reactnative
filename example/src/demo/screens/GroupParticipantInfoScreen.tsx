import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  GroupParticipantInfo,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantInfoScreen(props: Props) {
  const { route, navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const userId = ((route.params as any)?.params as any)?.userId;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
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
        onSendMessage={(data) => {
          if (data) {
            navigation.navigate('ConversationDetail', {
              params: {
                convId: data,
                convType: ChatConversationType.PeerChat,
                convName: data,
              },
            });
          }
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
