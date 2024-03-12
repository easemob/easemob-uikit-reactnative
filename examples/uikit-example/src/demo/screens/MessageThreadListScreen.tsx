import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';
import { MessageThreadList, MessageThreadModel } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function MessageThreadListScreen(props: Props) {
  const { route, navigation } = props;
  const parentId = ((route.params as any)?.params as any)?.parentId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <MessageThreadList
        parentId={parentId}
        onClickedItem={(model: MessageThreadModel) => {
          navigation.navigate('MessageThreadDetail', {
            params: {
              thread: model.thread,
              convId: model.thread.threadId,
              convType: ChatConversationType.GroupChat,
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
