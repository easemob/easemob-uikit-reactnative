import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  AVSelectGroupParticipant,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AVSelectGroupParticipantScreen(props: Props) {
  const { navigation, route } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;
  const from = ((route.params as any)?.params as any)?.from;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <AVSelectGroupParticipant
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        onBack={() => {
          navigation.goBack();
        }}
        onSelectResult={(data) => {
          if (from === 'GroupInfo') {
            navigation.navigate({
              name: 'GroupInfo',
              params: {
                params: {
                  convId: groupId,
                  ownerId: ownerId,
                  convType: 1,
                  selectedMembers: data,
                  from: 'AVSelectGroupParticipant',
                  hash: Date.now(),
                },
              },
              merge: true,
            });
          } else if (from === 'ConversationDetail') {
            navigation.navigate({
              name: 'ConversationDetail',
              params: {
                params: {
                  convId: groupId,
                  ownerId: ownerId,
                  convType: 1,
                  selectedMembers: data,
                  from: 'AVSelectGroupParticipant',
                  hash: Date.now(),
                },
              },
              merge: true,
            });
          } else if (from === 'MessageHistory') {
            navigation.navigate({
              name: 'MessageHistory',
              params: {
                params: {
                  convId: groupId,
                  ownerId: ownerId,
                  convType: 1,
                  selectedMembers: data,
                  from: 'AVSelectGroupParticipant',
                  hash: Date.now(),
                },
              },
              merge: true,
            });
          }
        }}
      />
    </SafeAreaView>
  );
}
