import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  MessageHistoryList,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageHistoryListScreen(props: Props) {
  const { route, navigation } = props;
  const message = ((route.params as any)?.params as any)?.message;
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
      <MessageHistoryList
        message={message}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
