import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  NewConversation,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewConversationScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
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
      <NewConversation
        containerStyle={{
          flexGrow: 1,
        }}
        onClickedSearch={() => {
          navi.navigate({
            to: 'SearchContact',
            props: {
              searchType: 'new-conversation',
            },
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
        onClickedItem={(data) => {
          navi.navigate({
            to: 'ConversationDetail',
            props: {
              convId: data?.userId,
              convType: ChatConversationType.PeerChat,
              convName: data?.userId,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
