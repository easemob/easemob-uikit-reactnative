import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatConversationType, ChatMessageThread } from 'react-native-chat-sdk';
import {
  ConversationDetail,
  ConversationDetailModelType,
  SendCardProps,
  SendCustomProps,
  SendFileProps,
  SendImageProps,
  SendSystemProps,
  SendTextProps,
  SendTimeProps,
  SendVideoProps,
  SendVoiceProps,
  uuid,
} from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateThreadScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const convId = React.useRef(uuid()).current;
  const convType = ((route.params as any)?.params as any)?.convType;
  const newName = ((route.params as any)?.params as any)?.newName;
  const parentId = ((route.params as any)?.params as any)?.parentId;
  const messageId = ((route.params as any)?.params as any)?.messageId;
  const comType =
    React.useRef<ConversationDetailModelType>('create_thread').current;

  const onCreateThreadResult = (
    thread?: ChatMessageThread,
    firstMessage?:
      | SendFileProps
      | SendImageProps
      | SendTextProps
      | SendVideoProps
      | SendVoiceProps
      | SendTimeProps
      | SendSystemProps
      | SendCardProps
      | SendCustomProps
  ) => {
    if (!thread) {
      navi.goBack();
    } else {
      navi.replace({
        to: 'MessageThreadDetail',
        props: {
          thread: thread,
          convId: thread.threadId,
          convType: ChatConversationType.GroupChat,
          firstMessage: firstMessage,
        },
      });
    }
  };

  return (
    <SafeAreaViewFragment>
      <ConversationDetail
        type={comType}
        convId={convId}
        convType={convType}
        newThreadName={newName}
        msgId={messageId}
        parentId={parentId}
        onCreateThreadResult={onCreateThreadResult}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
