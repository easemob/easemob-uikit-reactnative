import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import {
  UIConversationListListener,
  UIGroupListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import { usePermissions } from '../../hook';
import { useCreateConversationDirectory } from '../hooks/useCreateConversationDirectory';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import type {
  ConversationDetailProps,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SendCardProps,
  SendCustomProps,
  SendFileProps,
  SendImageProps,
  SendTextProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';

export function useConversationDetail(props: ConversationDetailProps) {
  const {
    convId,
    convType,
    testMode,
    input,
    list,
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
  const [convName, setConvName] = React.useState<string | undefined>();
  const [convAvatar, setConvAvatar] = React.useState<string>();
  const ownerIdRef = React.useRef<string>();
  const [doNotDisturb, setDoNotDisturb] = React.useState<boolean | undefined>(
    false
  );

  const { getPermission } = usePermissions();
  const { createDirectoryIfNotExisted } = useCreateConversationDirectory();
  const im = useChatContext();
  im.messageManager.setCurrentConv({ convId, convType });

  const setConversation = React.useCallback(async () => {
    const conv = await im.getConversation({
      convId,
      convType,
      createIfNotExist: true,
      fromNative: true,
    });
    console.log('dev:ConversationDetail:', conv);
    if (conv) {
      setDoNotDisturb(conv.doNotDisturb ?? false);
      if (conv.convType === ChatConversationType.PeerChat) {
        // todo: get user info
        // im.getUserInfo({
        //   userId: conv.convId,
        //   onResult: (result) => {
        //     if (result.isOk === true && result.value) {
        //       conv.convName =
        //         result.value?.userName && result.value?.userName.length > 0
        //           ? result.value?.userName
        //           : result.value?.userId;
        //       setConvName(conv.convName);
        //       if (result.value?.avatarURL) {
        //         conv.convAvatar = result.value.avatarURL;
        //         setConvAvatar(result.value.avatarURL);
        //       }
        //     }
        //   },
        // });
        setConvName(conv.convName);
        setConvAvatar(conv.convAvatar);
      } else if (conv.convType === ChatConversationType.GroupChat) {
        im.getGroupInfo({
          groupId: conv.convId,
          onResult: (result) => {
            if (result.isOk === true && result.value) {
              conv.convName =
                result.value.groupName && result.value?.groupName.length > 0
                  ? result.value?.groupName
                  : result.value.groupId;
              ownerIdRef.current = result.value.owner;
              setConvName(conv.convName);
              console.log('dev:ConversationDetail:', result.value);
              if (result.value.groupAvatar) {
                conv.convAvatar = result.value.groupAvatar;
                setConvAvatar(result.value.groupAvatar);
              } else {
                setConvAvatar(conv.convAvatar);
              }
            }
          },
        });
      }
      im.setConversationRead({ convId, convType });
    }
  }, [convId, convType, im]);

  const onClickedSend = React.useCallback(
    (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
        | SendCardProps
        | SendCustomProps
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

  React.useEffect(() => {
    getPermission({
      onResult: (isSuccess: boolean) => {
        permissionsRef.current = isSuccess;
      },
    });
  }, [getPermission]);

  React.useEffect(() => {
    im.messageManager.setCurrentConv({ convId, convType });
    setConversation();
    return () => {
      im.messageManager.setCurrentConv(undefined);
    };
  }, [convId, convName, convType, im, setConversation, testMode]);

  React.useEffect(() => {
    const listener: UIConversationListListener = {
      onUpdatedEvent: (data) => {
        if (data.convId === convId) {
          setDoNotDisturb(data.doNotDisturb ?? false);
        }
      },
      onRequestRefreshEvent: (id) => {
        if (id === convId) {
          setConversation();
        }
      },
      onRequestReloadEvent: (id) => {
        if (id === convId) {
          setConversation();
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [convId, im, setConversation]);

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onUpdatedEvent: (data) => {
        if (data.groupId === convId) {
          if (data.groupName) {
            setConvName(data.groupName);
          }
        }
      },
      onAddedEvent: (data) => {
        if (data.groupId === convId) {
          if (data.groupName) {
            setConvName(data.groupName);
          }
        }
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [convId, im]);

  React.useEffect(() => {
    createDirectoryIfNotExisted(convId);
  }, [convId, createDirectoryIfNotExisted]);

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
    doNotDisturb,
  };
}
