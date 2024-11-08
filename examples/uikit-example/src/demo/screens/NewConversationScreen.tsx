import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { ChatConversationType } from '../../rename.uikit';
import { NewConversation } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewConversationScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  return (
    <SafeAreaViewFragment>
      <NewConversation
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
    </SafeAreaViewFragment>
  );
}
