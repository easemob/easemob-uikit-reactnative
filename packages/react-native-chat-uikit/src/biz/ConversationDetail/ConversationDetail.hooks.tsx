import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { usePermissions } from '../../hook';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import type {
  ConversationDetailProps,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SendCardProps,
  SendFileProps,
  SendImageProps,
  SendTextProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';
import { useCreateConversationDirectory } from './useCreateConversationDirectory';

export function useConversationDetail(props: ConversationDetailProps) {
  const {
    convId,
    convType,
    convName: propsConvName,
    testMode,
    input,
    list,
    onInitialized,
    onClickedAvatar: propsOnClickedAvatar,
  } = props;
  const permissionsRef = React.useRef(false);

  const messageInputRef = React.useRef<MessageInputRef>({} as any);
  const messageListRef = React.useRef<MessageListRef>({} as any);
  const _messageInputRef = input?.ref ?? messageInputRef;
  const _MessageInput = input?.render ?? MessageInput;
  const messageInputProps = input?.props
    ? { ...input.props, convId, convType, testMode }
    : { convId, convType, testMode };
  const _messageListRef = list?.ref ?? messageListRef;
  const _MessageList = list?.render ?? MessageList;
  const messageListProps = list?.props
    ? { ...list.props, convId, convType, testMode }
    : { convId, convType, testMode };
  const [convName, setConvName] = React.useState<string | undefined>(
    propsConvName
  );
  const [convAvatar, setConvAvatar] = React.useState<string>();
  const ownerIdRef = React.useRef<string>();

  usePermissions({
    onResult: (isSuccess) => {
      permissionsRef.current = isSuccess;
    },
  });
  const { createDirectoryIfNotExisted } = useCreateConversationDirectory();
  const im = useChatContext();
  im.messageManager.setCurrentConvId({ convId, convType, convName });

  const setConversation = React.useCallback(async () => {
    const conv = await im.getConversation({
      convId,
      convType,
      createIfNotExist: true,
      fromNative: true,
    });
    console.log('test:zuoyu:setconver:', conv);
    if (conv) {
      if (conv.convType === ChatConversationType.PeerChat) {
        im.getUserInfo({
          userId: conv.convId,
          onResult: (result) => {
            if (result.isOk === true && result.value) {
              conv.convName = result.value?.userName ?? result.value?.remark;
              setConvName(result.value?.userName ?? result.value?.remark);
              if (result.value?.avatarURL) {
                conv.convAvatar = result.value.avatarURL;
                setConvAvatar(result.value.avatarURL);
              }
              im.messageManager.setCurrentConvId({ ...conv });
            }
          },
        });
      } else if (conv.convType === ChatConversationType.GroupChat) {
        im.getGroupInfo({
          groupId: conv.convId,
          onResult: (result) => {
            console.log('test:zuoyu:gourp:', result);
            if (result.isOk === true && result.value) {
              conv.convName = result.value.groupName ?? result.value.groupId;
              ownerIdRef.current = result.value.owner;
              setConvName(result.value.groupName ?? result.value.groupId);
              if (result.value.groupAvatar) {
                conv.convAvatar = result.value.groupAvatar;
                setConvAvatar(result.value.groupAvatar);
              }
              im.messageManager.setCurrentConvId({ ...conv });
            }
          },
        });
      }
      im.setCurrentConversation({ conv });
      im.setConversationRead({ convId, convType });
    }
  }, [convId, convType, im]);

  React.useEffect(() => {
    const conv = im.getCurrentConversation();
    if (testMode === 'only-ui') {
      if (conv === undefined || conv.convId !== convId) {
        im.setCurrentConversation({ conv: { convId, convType, convName } });
        onInitialized?.(true);
      } else {
        onInitialized?.(false);
      }
    } else {
      setConversation()
        .then(() => {
          onInitialized?.(true);
        })
        .catch(() => {
          onInitialized?.(false);
        });
    }
    return () => {
      const conv = im.getCurrentConversation();
      if (conv) {
        im.setCurrentConversation({ conv: undefined });
      }
    };
  }, [
    convId,
    convName,
    convType,
    im,
    onInitialized,
    setConversation,
    testMode,
  ]);

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
        | SendCardProps
    ) => {
      _messageListRef.current?.addSendMessage(value);
    },
    [_messageListRef]
  );

  const onQuoteMessageForInput = React.useCallback(
    (model: MessageModel) => {
      _messageInputRef.current?.quoteMessage?.(model);
    },
    [_messageInputRef]
  );

  const onEditMessageForInput = React.useCallback(
    (model: MessageModel) => {
      _messageInputRef.current?.editMessage?.(model);
    },
    [_messageInputRef]
  );

  const onEditMessageFinished = React.useCallback(
    (model: MessageModel) => {
      _messageListRef.current?.editMessageFinished?.(model);
    },
    [_messageListRef]
  );

  const onClickedAvatar = React.useCallback(() => {
    propsOnClickedAvatar?.({
      convId: convId,
      convType: convType,
      ownerId: ownerIdRef.current,
    });
  }, [convId, convType, propsOnClickedAvatar]);

  return {
    onClickedSend,
    _messageInputRef,
    _MessageInput,
    messageInputProps,
    _messageListRef,
    _MessageList,
    messageListProps,
    onQuoteMessageForInput,
    onEditMessageForInput,
    onEditMessageFinished,
    convName,
    convAvatar,
    onClickedAvatar,
  };
}
