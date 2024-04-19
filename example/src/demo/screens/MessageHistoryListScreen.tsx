import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatMessageType } from 'react-native-chat-sdk';
import {
  MessageHistoryList,
  MessageHistoryModel,
} from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageHistoryListScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const message = ((route.params as any)?.params as any)?.message;

  const onClickedItem = React.useCallback((model: MessageHistoryModel) => {
    if (model.msg.body.type === ChatMessageType.COMBINE) {
      // navi.push('MessageHistoryList', {
      //   params: { message: model.msg },
      // });
    } else if (model.msg.body.type === ChatMessageType.IMAGE) {
      // console.log('image');
      // im.messageManager
      //   .downloadAttachment(model.msg)
      //   .then((res) => {
      //     console.log('downloadAttachment', res);
      //   })
      //   .catch((e) => {
      //     console.warn('downloadAttachment', e);
      //   });
      // im.client.chatManager
      //   .downloadAttachmentInCombine(model.msg, {
      //     onProgress: (localMsgId: string, progress: number) => {
      //       console.log('progress', progress);
      //     },
      //     onError: (localMsgId: string, error: ChatError) => {
      //       console.log('error', error);
      //     },
      //     onSuccess: (message: ChatMessage) => {
      //       console.log('success', message);
      //     },
      //   } as ChatMessageStatusCallback)
      //   .then()
      //   .catch((e) => {
      //   });
    }
  }, []);

  return (
    <SafeAreaViewFragment>
      <MessageHistoryList
        message={message}
        onBack={() => {
          navi.goBack();
        }}
        onClickedItem={onClickedItem}
      />
    </SafeAreaViewFragment>
  );
}
