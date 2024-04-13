import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  MessageThreadMemberList,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function MessageThreadMemberListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const thread = ((route.params as any)?.params as any)?.thread;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <MessageThreadMemberList
        thread={thread}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
