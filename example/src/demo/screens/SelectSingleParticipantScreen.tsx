import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  SelectSingleParticipant,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SelectSingleParticipantScreen(props: Props) {
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
      <SelectSingleParticipant
        containerStyle={{
          flexGrow: 1,
        }}
        groupId={groupId}
        onBack={() => {
          navi.goBack();
        }}
        onClickedItem={(data) => {
          navi.navigate({
            to: 'ConversationDetail',
            props: {
              convId: groupId,
              convType: 1,
              convName: groupId,
              selectedParticipants: data,
              operateType: 'mention',
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
