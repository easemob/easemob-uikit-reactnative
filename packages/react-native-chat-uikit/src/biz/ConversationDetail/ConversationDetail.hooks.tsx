import * as React from 'react';

import {
  gCmdMessageTyping,
  MessageServiceListener,
  UIContactListListener,
  UIConversationListListener,
  UIGroupListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import { uilog } from '../../const';
import { useDelayExecTask, usePermissions } from '../../hook';
import {
  ChatCmdMessageBody,
  ChatConversationType,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageThreadEvent,
  ChatMessageThreadOperation,
  ChatMessageType,
} from '../../rename.chat';
import { timeoutTask } from '../../utils';
import { useCreateConversationDirectory } from '../hooks/useCreateConversationDirectory';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import type {
  ConversationDetailProps,
  ConversationSelectModeType,
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
    propsRef,
    type: comType,
    selectType = 'common',
    convId,
    convType,
    thread,
    newThreadName,
    msgId,
    parentId,
    testMode,
    input,
    list,
    onClickedAvatar: propsOnClickedAvatar,
    onThreadDestroyed,
    onThreadKicked,
    onForwardMessage,
    onCreateThreadResult,
    firstMessage,
  } = props;
  const permissionsRef = React.useRef(false);
  const messageInputRef = React.useRef<MessageInputRef>({} as any);
  const messageListRef = React.useRef<MessageListRef>({} as any);
  const [selectMode, setSelectMode] = React.useState(selectType);
  const [multiSelectCount, setMultiSelectCount] = React.useState(0);
  const _messageInputRef = input?.ref ?? messageInputRef;
  const _MessageInput = input?.render ?? MessageInput;
  const { onChangeValue: propsOnChangeValue } = input?.props ?? {};
  let messageInputProps = input?.props
    ? { ...input.props, convId, convType, type: comType, thread, testMode }
    : { convId, convType, type: comType, thread, testMode };
  const _messageListRef = list?.ref ?? messageListRef;
  const _MessageList = list?.render ?? MessageList;
  const messageListProps = list?.props
    ? {
        ...list.props,
        convId,
        convType,
        type: comType,
        thread,
        newThreadName,
        msgId,
        parentId,
        testMode,
        firstMessage,
        onCreateThreadResult,
      }
    : {
        convId,
        convType,
        type: comType,
        thread,
        newThreadName,
        msgId,
        parentId,
        testMode,
        firstMessage,
        onCreateThreadResult,
      };
  const [convName, setConvName] = React.useState<string | undefined>();
  const [convRemark, setConvRemark] = React.useState<string | undefined>();
  const [threadName, setThreadName] = React.useState<string | undefined>(
    newThreadName
  );
  const [parentName, setParentName] = React.useState<string | undefined>();
  const [convAvatar, setConvAvatar] = React.useState<string>();
  const ownerIdRef = React.useRef<string>();
  const [doNotDisturb, setDoNotDisturb] = React.useState<boolean | undefined>(
    false
  );
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [messageTyping, setMessageTyping] = React.useState<boolean>(false);

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
      isChatThread: comType === 'thread' || comType === 'create_thread',
    });
    uilog.log('ConversationDetail:', conv);
    if (conv) {
      setDoNotDisturb(conv.doNotDisturb ?? false);
      if (conv.convType === ChatConversationType.PeerChat) {
        im.getUserInfo({
          userId: conv.convId,
          onResult: (result) => {
            if (result.isOk === true && result.value) {
              conv.convName =
                result.value?.userName && result.value?.userName.length > 0
                  ? result.value?.userName
                  : result.value?.userId;
              setConvName(conv.convName);
              if (result.value?.avatarURL) {
                conv.convAvatar = result.value.avatarURL;
                setConvAvatar(result.value.avatarURL);
              }
            }
          },
        });
        im.getContact({
          userId: convId,
          onResult: (res) => {
            if (res.isOk && res.value) {
              if (res.value.remark && res.value.remark.length > 0) {
                setConvRemark(res.value.remark);
              }
            }
          },
        });
      } else if (conv.convType === ChatConversationType.GroupChat) {
        if (comType === 'chat') {
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
                if (result.value.groupAvatar) {
                  conv.convAvatar = result.value.groupAvatar;
                  setConvAvatar(result.value.groupAvatar);
                } else {
                  setConvAvatar(conv.convAvatar);
                }
              }
            },
          });
        } else if (comType === 'thread') {
          if (thread) {
            im.joinThread({ threadId: thread?.threadId });
            im.fetchThread({
              threadId: thread.threadId,
              onResult: (res) => {
                if (res.isOk && res.value) {
                  setThreadName(res.value.threadName);
                }
              },
            });
            if (thread && thread.parentId) {
              im.getGroupInfo({
                groupId: thread.parentId,
                onResult: (res) => {
                  if (res.isOk && res.value) {
                    setParentName(res.value.groupName ?? convId);
                  } else {
                    setParentName(convId);
                  }
                },
              });
            }
          }
        }
      }
    }
  }, [convId, convType, im, thread, comType]);

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
      timeoutTask(0, () => {
        _messageListRef.current?.addSendMessage(value);
      });
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

  const onClickedThreadMore = React.useCallback(() => {
    _messageListRef.current?.startShowThreadMoreMenu?.();
  }, [_messageListRef]);

  const onClickedMultiSelected = React.useCallback(() => {
    setSelectMode('multi');
    _messageInputRef.current?.showMultiSelect?.();
  }, [_messageInputRef]);

  const onCancelMultiSelected = React.useCallback(() => {
    setSelectMode('common');
    _messageInputRef.current?.hideMultiSelect?.();
  }, [_messageInputRef]);

  const onClickedMultiSelectDeleteButton = React.useCallback(() => {
    _messageListRef.current?.removeMultiSelected?.((confirmed) => {
      if (confirmed === true) {
        onCancelMultiSelected();
      }
    });
  }, [_messageListRef, onCancelMultiSelected]);
  const onClickedMultiSelectShareButton = React.useCallback(() => {
    const list = _messageListRef.current?.getMultiSelectedMessages?.();
    if (list) {
      onForwardMessage?.(list);
    }
  }, [_messageListRef, onForwardMessage]);

  const onChangeMultiItems = React.useCallback((items: MessageModel[]) => {
    setMultiSelectCount(items.length);
  }, []);

  const onClickedSingleSelect = React.useCallback(
    (item: MessageModel) => {
      onForwardMessage?.([item.msg]);
    },
    [onForwardMessage]
  );

  const onChangeUnreadCount = React.useCallback((unreadCount: number) => {
    setUnreadCount(unreadCount);
  }, []);

  const onClickedUnreadCount = React.useCallback(() => {
    if (comType === 'chat' || comType === 'search') {
      im.setConversationRead({ convId, convType });
    }
    _messageListRef.current?.scrollToBottom?.();
  }, [_messageListRef, comType, convId, convType, im]);

  const sendCmdTypingMessage = React.useCallback(() => {
    const msg = ChatMessage.createCmdMessage(
      convId,
      gCmdMessageTyping,
      ChatMessageChatType.PeerChat,
      {
        isChatThread: comType === 'thread' || comType === 'create_thread',
        deliverOnlineOnly: true,
      }
    );
    _messageListRef.current?.sendMessageToServer(msg);
  }, [_messageListRef, comType, convId]);

  const onInputValueChanged = React.useCallback(
    (text: string) => {
      propsOnChangeValue?.(text);
      if (convType === ChatConversationType.PeerChat) {
        sendCmdTypingMessage();
      }
    },
    [convType, propsOnChangeValue, sendCmdTypingMessage]
  );
  messageInputProps = {
    ...messageInputProps,
    onChangeValue: onInputValueChanged,
  };

  React.useEffect(() => {
    getPermission({
      onResult: (isSuccess: boolean) => {
        permissionsRef.current = isSuccess;
      },
    });
  }, [getPermission]);

  const getNickName = React.useCallback(() => {
    if (convRemark && convRemark.length > 0) {
      return convRemark;
    } else if (convName && convName.length > 0) {
      return convName;
    } else {
      return convId;
    }
  }, [convId, convName, convRemark]);

  const startMessageTyping = React.useCallback(() => {
    setMessageTyping(true);
  }, []);

  const { delayExecTask: stopMessageTyping } = useDelayExecTask(
    5000,
    React.useCallback(() => {
      setMessageTyping(false);
    }, [])
  );

  const onMessageTyping = React.useCallback(
    (msg: ChatMessage) => {
      if (
        convType === ChatConversationType.PeerChat &&
        convId === msg.conversationId
      ) {
        if (msg.body.type === ChatMessageType.CMD) {
          const body = msg.body as ChatCmdMessageBody;
          if (body.action === gCmdMessageTyping) {
            startMessageTyping();
            stopMessageTyping();
          }
        }
      }
    },
    [convId, convType, startMessageTyping, stopMessageTyping]
  );

  React.useEffect(() => {
    im.messageManager.setCurrentConv({ convId, convType });
    if (comType === 'chat' || comType === 'search') {
      im.setConversationRead({ convId, convType });
    }
    setConversation();
    return () => {
      im.messageManager.setCurrentConv(undefined);
      if (comType === 'chat' || comType === 'search') {
        im.setConversationRead({ convId, convType });
      }
    };
  }, [
    comType,
    convId,
    convName,
    convType,
    im,
    setConversation,
    testMode,
    thread,
  ]);

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
    const listener: UIContactListListener = {
      onUpdatedEvent: (data) => {
        if (data.userId === convId) {
          setConvAvatar(data.userAvatar);
          setConvName(data.userName);
          setConvRemark(data.remark);
        }
      },
      type: UIListenerType.Contact,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [convId, im]);

  React.useEffect(() => {
    const listener: UIGroupListListener = {
      onUpdatedEvent: (data) => {
        if (data.groupId === convId) {
          if (data.groupAvatar && data.groupAvatar.length > 0) {
            setConvAvatar(data.groupAvatar);
          }
          if (data.groupName && data.groupName.length > 0) {
            setConvName(data.groupName);
          }
        }
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [convId, im]);

  React.useEffect(() => {
    const listener = {
      onChatMessageThreadUpdated: (event: ChatMessageThreadEvent) => {
        if (
          thread?.threadId === event.thread.threadId &&
          threadName !== event.thread.threadName
        ) {
          setThreadName(event.thread.threadName);
        }
      },
      onChatMessageThreadDestroyed: (event: ChatMessageThreadEvent) => {
        if (thread?.threadId === event.thread.threadId) {
          onThreadDestroyed?.(thread);
        }
      },
      onChatMessageThreadUserRemoved: (event: ChatMessageThreadEvent) => {
        if (
          thread?.threadId === event.thread.threadId &&
          event.type === ChatMessageThreadOperation.Delete
        ) {
          onThreadKicked?.(thread);
        }
      },
      onCmdMessagesReceived: (messages) => {
        if (messages.length > 0) {
          for (const msg of messages) {
            if (msg.body.type === ChatMessageType.CMD) {
              onMessageTyping(msg);
            }
          }
        }
      },
    } as MessageServiceListener;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [
    im,
    onMessageTyping,
    onThreadDestroyed,
    onThreadKicked,
    thread,
    threadName,
  ]);

  React.useEffect(() => {
    createDirectoryIfNotExisted(convId);
  }, [convId, createDirectoryIfNotExisted]);

  if (propsRef && propsRef.current) {
    propsRef.current.sendCardMessage = (props: SendCardProps) => {
      onClickedSend(props);
    };
    propsRef.current.changeSelectType = (type: ConversationSelectModeType) => {
      if (type === 'common') {
        onCancelMultiSelected();
      } else {
        onClickedMultiSelected();
      }
    };
  }

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
    onClickedThreadMore,
    threadName,
    onClickedMultiSelected,
    onCancelMultiSelected,
    selectMode,
    onClickedMultiSelectDeleteButton,
    onClickedMultiSelectShareButton,
    multiSelectCount,
    onChangeMultiItems,
    onClickedSingleSelect,
    onChangeUnreadCount,
    unreadCount,
    onClickedUnreadCount,
    getNickName,
    parentName,
    messageTyping,
  };
}
