import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  MessageThreadList,
  MessageThreadModel,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function MessageThreadListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const parentId = ((route.params as any)?.params as any)?.parentId;
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
      <MessageThreadList
        parentId={parentId}
        onClickedItem={(model: MessageThreadModel) => {
          navi.navigate({
            to: 'MessageThreadDetail',
            props: {
              thread: model.thread,
              convId: model.thread.threadId,
              convType: ChatConversationType.GroupChat,
            },
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
