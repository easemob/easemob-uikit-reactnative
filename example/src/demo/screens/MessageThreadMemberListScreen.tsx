import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { MessageThreadMemberList } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function MessageThreadMemberListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const thread = ((route.params as any)?.params as any)?.thread;
  return (
    <SafeAreaViewFragment>
      <MessageThreadMemberList
        thread={thread}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
