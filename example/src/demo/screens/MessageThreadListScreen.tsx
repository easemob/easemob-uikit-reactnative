import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { ChatConversationType } from '../../rename.uikit';
import { MessageThreadList, MessageThreadModel } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function MessageThreadListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const parentId = ((route.params as any)?.params as any)?.parentId;
  return (
    <SafeAreaViewFragment>
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
    </SafeAreaViewFragment>
  );
}
