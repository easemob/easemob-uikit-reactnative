import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatMessageType } from 'react-native-chat-sdk';
import {
  MessageHistoryList,
  MessageHistoryModel,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageHistoryListScreen(props: Props) {
  const { route, navigation } = props;
  const message = ((route.params as any)?.params as any)?.message;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  const onClickedItem = React.useCallback((model: MessageHistoryModel) => {
    if (model.msg.body.type === ChatMessageType.COMBINE) {
      // navigation.push('MessageHistoryList', {
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
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <MessageHistoryList
        message={message}
        onBack={() => {
          navigation.goBack();
        }}
        onClickedItem={onClickedItem}
      />
    </SafeAreaView>
  );
}
