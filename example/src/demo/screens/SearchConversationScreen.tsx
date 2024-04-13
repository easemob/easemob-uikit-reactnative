import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  SearchConversation,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchConversationScreen(props: Props) {
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
      <SearchConversation
        containerStyle={{
          flexGrow: 1,
        }}
        onCancel={() => {
          navi.goBack();
        }}
        onClicked={(data) => {
          if (data) {
            navi.navigation.pop();
            navi.navigate({
              to: 'ConversationDetail',
              props: {
                convId: data?.convId,
                convType: data?.convType,
                convName: data?.convName,
                convAvatar: data?.convAvatar,
              },
            });
          }
        }}
      />
    </SafeAreaView>
  );
}
