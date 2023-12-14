import * as React from 'react';

import { useChatContext } from '../../chat';
import { usePermissions } from '../../hook';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import type {
  ConversationDetailProps,
  MessageInputRef,
  MessageListRef,
  SendFileProps,
  SendImageProps,
  SendTextProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';
import { useCreateConversationDirectory } from './useCreateConversationDirectory';

export function useConversationDetail(props: ConversationDetailProps) {
  const { convId, convType, testMode, input, list } = props;
  const permissionsRef = React.useRef(false);

  const messageInputRef = React.useRef<MessageInputRef>({} as any);
  const messageListRef = React.useRef<MessageListRef>({} as any);
  const _messageInputRef = input?.ref ?? messageInputRef;
  const _MessageInput = input?.render ?? MessageInput;
  const messageInputProps = input?.props
    ? { ...input.props, convId, testMode }
    : { convId, testMode };
  const _messageListRef = list?.ref ?? messageListRef;
  const _MessageList = list?.render ?? MessageList;
  const messageListProps = list?.props
    ? { ...list.props, convId, convType, testMode }
    : { convId, convType, testMode };

  usePermissions({
    onResult: (isSuccess) => {
      permissionsRef.current = isSuccess;
    },
  });
  const { createDirectoryIfNotExisted } = useCreateConversationDirectory();
  const im = useChatContext();

  const setConversation = React.useCallback(async () => {
    const conv = await im.getConversation({
      convId,
      convType,
      createIfNotExist: true,
    });
    if (conv) {
      im.setCurrentConversation({ conv });
    }
  }, [convId, convType, im]);

  React.useEffect(() => {
    const conv = im.getCurrentConversation();
    if (conv === undefined || conv.convId !== convId) {
      if (testMode === 'only-ui') {
        im.setCurrentConversation({ conv: { convId, convType } });
      } else {
        setConversation().then(() => {
          // todo: ready
        });
      }
    }
  }, [convId, convType, im, setConversation, testMode]);

  React.useEffect(() => {
    createDirectoryIfNotExisted(convId);
  }, [convId, createDirectoryIfNotExisted]);

  const onClickedSend = React.useCallback(
    (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
    ) => {
      _messageListRef.current?.addSendMessage(value);
    },
    [_messageListRef]
  );

  return {
    onClickedSend,
    _messageInputRef,
    _MessageInput,
    messageInputProps,
    _messageListRef,
    _MessageList,
    messageListProps,
  };
}
