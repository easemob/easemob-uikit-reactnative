import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  GroupParticipantList,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <GroupParticipantList
        groupId={groupId}
        containerStyle={{
          flexGrow: 1,
        }}
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
    </SafeAreaView>
  );
}
