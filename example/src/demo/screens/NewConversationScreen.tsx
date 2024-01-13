import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  NewConversation,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewConversationScreen(props: Props) {
  const { navigation } = props;
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
          // backgroundColor: 'red',
        }}
        onClickedSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'new-conversation' },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
        onClickedItem={(data) => {
          navigation.navigate('ConversationDetail', {
            params: {
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
