import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SearchConversation } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchConversationScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  return (
    <SafeAreaViewFragment>
      <SearchConversation
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
    </SafeAreaViewFragment>
  );
}
