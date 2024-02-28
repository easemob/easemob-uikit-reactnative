import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { MessageThreadMemberList } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function MessageThreadMemberListScreen(props: Props) {
  const { route, navigation } = props;
  const thread = ((route.params as any)?.params as any)?.thread;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <MessageThreadMemberList
        thread={thread}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
