import * as React from 'react';
import type {
  LayoutChangeEvent,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageReaction,
  ChatMessageReactionEvent,
  ChatMessageStatus,
  ChatMessageThread,
  ChatMessageThreadEvent,
  ChatMessageType,
  ChatSearchDirection,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import { FACE_ASSETS } from '../../assets';
import {
  gCustomMessageCardEventType,
  gMessageAttributeQuote,
  gMessageAttributeTranslate,
  gMessageAttributeVoiceReadFlag,
  MessageServiceListener,
  ResultCallback,
  UIConversationListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { useConfigContext } from '../../config';
// import { useDispatchContext } from '../../dispatch';
import { useDelayExecTask } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { LocalPath, seqId, timeoutTask } from '../../utils';
import type { BottomSheetEmojiListRef } from '../BottomSheetEmojiList/BottomSheetEmojiList';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { BottomSheetReactionDetailRef } from '../BottomSheetReactionDetail';
import { gReportMessageList } from '../const';
import { useMessageContext } from '../Context';
import { useMessageThreadListMoreActions } from '../hooks';
import { useCloseMenu } from '../hooks/useCloseMenu';
import {
  useEmojiLongPressActionsProps,
  useMessageLongPressActions,
} from '../hooks/useMessageLongPressActions';
import { useFlatList } from '../List';
import type {
  BottomSheetMessageReportRef,
  ReportItemModel,
} from '../MessageReport';
import type { EmojiIconItem } from '../types';
import { gRequestMaxMessageCount } from './const';
import { MessageListItemMemo } from './MessageListItem';
import { getQuoteAttribute } from './MessageListItem.hooks';
import type {
  MessageAddPosition,
  MessageHistoryModel,
  MessageListItemComponentType,
  MessageListItemProps,
  MessageListItemRenders,
  MessageListProps,
  MessageListRef,
  MessageModel,
  SendCardProps,
  SendCustomProps,
  SendFileProps,
  SendImageProps,
  SendSystemProps,
  SendTextProps,
  SendTimeProps,
  SendVideoProps,
  SendVoiceProps,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export function useMessageList(
  props: MessageListProps,
  ref?: React.ForwardedRef<MessageListRef>
) {
  const {
    type: comType,
    convId,
    convType,
    thread,
    msgId,
    parentId,
    newThreadName,
    testMode,
    onClickedItem: propsOnClicked,
    onLongPressItem: propsOnLongPress,
    onQuoteMessageForInput: propsOnQuoteMessageForInput,
    onEditMessageForInput: propsOnEditMessageForInput,
    reportMessageCustomList = gReportMessageList,
    onClickedItemAvatar: propsOnClickedItemAvatar,
    onClickedItemQuote: propsOnClickedItemQuote,
    listItemRenderProps: propsListItemRenderProps,
    recvMessageAutoScroll = false,
    onInitMenu,
    onCopyFinished: propsOnCopyFinished,
    onCreateThread: propsOnCreateThread,
    onOpenThread: propsOnOpenThread,
    messageLayoutType,
    onNoMoreMessage,
    onCreateThreadResult,
    firstMessage,
    onClickedEditThreadName,
    onClickedLeaveThread,
    onClickedOpenThreadMemberList,
    onClickedMultiSelected,
    selectType,
    onChangeMultiItems,
    onClickedSingleSelect,
    onClickedHistoryDetail,
    onChangeUnreadCount,
  } = props;
  const inverted = React.useRef(comType === 'chat' ? true : false).current;

  const enableRefresh =
    comType === 'chat' || comType === 'create_thread' || comType === 'thread'
      ? false
      : true;
  const enableMore = comType === 'create_thread' ? false : true;

  const flatListProps = useFlatList<MessageListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
    enableRefresh: enableRefresh,
    enableMore: enableMore,
  });
  const {
    dataRef,
    setData,
    isAutoLoad,
    listState,
    listType,
    ref: listRef,
  } = flatListProps;

  const [refreshing, setRefreshing] = React.useState(false);
  const preBottomDataRef = React.useRef<MessageListItemProps>();
  const scrollEventThrottle = React.useRef(16).current;
  const needScrollRef = React.useRef(true);
  const userScrollGestureRef = React.useRef(false);
  const isBottomRef = React.useRef(true);
  const isTopRef = React.useRef(true);
  const heightRef = React.useRef(0);
  const bounces = React.useRef(true).current;
  const currentVoicePlayingRef = React.useRef<MessageModel | undefined>();
  const { tr } = useI18nContext();
  const im = useChatContext();
  const startMsgIdRef = React.useRef('');
  const [maxListHeight, setMaxListHeight] = React.useState<number>(0);
  const tmpMessageListRef = React.useRef<MessageModel[]>([]);
  // !!! https://github.com/facebook/react-native/issues/36529
  // !!! https://github.com/facebook/react-native/issues/14312
  // !!! only android, FlatList onEndReached no work android
  const [reachedThreshold] = React.useState(0.5);
  const reportDataRef = React.useRef<ReportItemModel[]>(
    reportMessageCustomList.map((d, i) => {
      return {
        id: i.toString(),
        tag: d.key,
        title: tr(d.value),
        checked: false,
      };
    })
  );
  // There is no more data.
  const hasNoMoreRef = React.useRef(false);
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const reportRef = React.useRef<BottomSheetMessageReportRef>(null);
  const alertRef = React.useRef<AlertRef>(null);
  const currentReportMessageRef = React.useRef<MessageModel>();
  const { closeMenu } = useCloseMenu({ menuRef });
  const MessageListItemRef = React.useRef<MessageListItemComponentType>(
    propsListItemRenderProps?.ListItemRender ?? MessageListItemMemo
  );
  const listItemRenderPropsRef = React.useRef<MessageListItemRenders>({
    ...propsListItemRenderProps,
  });
  const {} = useMessageContext();
  const { recallTimeout, languageCode } = useConfigContext();

  const setNeedScroll = React.useCallback((needScroll: boolean) => {
    console.log('test:zuoyu:needScroll:', needScroll);
    needScrollRef.current = needScroll;
  }, []);
  const setUserScrollGesture = React.useCallback((isUserScroll: boolean) => {
    userScrollGestureRef.current = isUserScroll;
  }, []);
  // const { addListener, removeListener, emit } = useDispatchContext();
  const emojiRef = React.useRef<BottomSheetEmojiListRef>(null);
  const onRequestCloseEmoji = React.useCallback(() => {
    emojiRef.current?.startHide?.();
  }, []);
  const emojiListRef = React.useRef<EmojiIconItem[]>(
    FACE_ASSETS.map((v) => {
      return { name: v, state: 'common' } as EmojiIconItem;
    })
  );
  const reactionRef = React.useRef<BottomSheetReactionDetailRef>(null);
  const onRequestCloseReaction = React.useCallback(() => {
    reactionRef.current?.startHide?.();
  }, []);

  const needScrollToBottom = React.useCallback(() => {
    if (needScrollRef.current === true) {
      return true;
    }
    return false;
  }, []);

  const scrollToBottom = React.useCallback(
    (animated?: boolean) => {
      if (needScrollToBottom() === true) {
        timeoutTask(0, () => {
          if (inverted === true) {
            listRef?.current?.scrollToIndex?.({ index: 0, animated });
          } else {
            listRef?.current?.scrollToEnd?.();
          }
        });
      }
    },
    [inverted, listRef, needScrollToBottom]
  );

  const scrollTo = React.useCallback(
    (index: number, animated?: boolean) => {
      // setNeedScroll(false);
      timeoutTask(0, () => {
        listRef?.current?.scrollToIndex?.({ index, animated, viewPosition: 1 });
      });
    },
    [listRef]
  );

  const onRenderItem = React.useCallback(
    (info: ListRenderItemInfo<MessageListItemProps>) => {
      for (const d of dataRef.current) {
        if (d.id === info.item.id) {
          d.index = info.index;
          break;
        }
      }
    },
    [dataRef]
  );

  const removeDuplicateData = React.useCallback(
    (list: MessageListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => {
            if (
              item.model.modelType === 'message' &&
              t.model.modelType === 'message'
            ) {
              const msgModel = item.model as MessageModel;
              const tMsgModel = t.model as MessageModel;
              if (
                msgModel.msg.status === ChatMessageStatus.SUCCESS &&
                tMsgModel.msg.status === ChatMessageStatus.SUCCESS
              ) {
                if (msgModel.msg.msgId === tMsgModel.msg.msgId) {
                  return true;
                }
              } else {
                if (msgModel.msg.localMsgId === tMsgModel.msg.localMsgId) {
                  return true;
                }
              }
            } else if (
              item.model.modelType === 'history' &&
              t.model.modelType === 'history'
            ) {
              const msgModel = item.model as MessageHistoryModel;
              const tMsgModel = t.model as MessageHistoryModel;
              if (msgModel.msg.msgId === tMsgModel.msg.msgId) {
                return true;
              }
            } else if (
              item.model.modelType === 'system' &&
              t.model.modelType === 'system'
            ) {
              const msgModel = item.model as SystemMessageModel;
              const tMsgModel = t.model as SystemMessageModel;
              if (msgModel.msg.msgId === tMsgModel.msg.msgId) {
                return true;
              }
            } else if (
              item.model.modelType === 'time' &&
              t.model.modelType === 'time'
            ) {
              const msgModel = item.model as TimeMessageModel;
              const tMsgModel = t.model as TimeMessageModel;
              if (msgModel.timestamp === tMsgModel.timestamp) {
                return true;
              }
            }
            return false;
          })
      );
      return uniqueList;
    },
    []
  );

  const _refreshToUI = React.useCallback(
    (items: MessageListItemProps[]) => {
      setData([...items]);
    },
    [setData]
  );

  const refreshToUI = React.useCallback(
    (items: MessageListItemProps[]) => {
      dataRef.current = removeDuplicateData(items);
      if (needScrollToBottom() === true) {
        if (dataRef.current.length > 0) {
          if (inverted === true) {
            preBottomDataRef.current = dataRef.current[0];
          } else {
            preBottomDataRef.current =
              dataRef.current[dataRef.current.length - 1];
          }
        }
        _refreshToUI(dataRef.current);
        onChangeUnreadCount?.(0);
      } else {
        const index = dataRef.current.findIndex((d) => {
          if (d.id === preBottomDataRef.current?.id) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          // !!!: Get the element after the specified position in the array and return
          if (inverted === true) {
            const tmp = dataRef.current.slice(index);
            _refreshToUI(tmp);
            onChangeUnreadCount?.(dataRef.current.length - tmp.length);
          } else {
            const tmp = dataRef.current.slice(0, index + 1);
            _refreshToUI(tmp);
            onChangeUnreadCount?.(dataRef.current.length - tmp.length);
          }
        } else {
          _refreshToUI(dataRef.current);
          onChangeUnreadCount?.(0);
        }
      }
    },
    [
      dataRef,
      removeDuplicateData,
      needScrollToBottom,
      _refreshToUI,
      onChangeUnreadCount,
      inverted,
    ]
  );

  // !!! Both gestures and scrolling methods are triggered on the ios platform. However, the android platform only has gesture triggering.
  const onMomentumScrollEnd = React.useCallback(() => {}, []);

  const { delayExecTask } = useDelayExecTask(
    500,
    React.useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        if (inverted === true) {
          console.log('test:zuoyu:delayExecTask:', y);
          if (y < 10) {
            setNeedScroll(true);
            const preId = preBottomDataRef.current?.id;
            refreshToUI(dataRef.current);
            const item = dataRef.current.find((d) => {
              if (d.id === preId) {
                return true;
              }
              return false;
            });
            if (item?.index !== undefined) {
              scrollTo(item.index, false);
            }
          } else {
            setNeedScroll(false);
          }
        } else {
          if (
            y + heightRef.current >
            event.nativeEvent.contentSize.height - 10
          ) {
            setNeedScroll(true);
            // const preId = preBottomDataRef.current?.id;
            // refreshToUI(dataRef.current);
            // const item = dataRef.current.find((d) => {
            //   if (d.id === preId) {
            //     return true;
            //   }
            //   return false;
            // });
            // if (item?.index !== undefined) {
            //   scrollTo(item.index, false);
            // }
          } else {
            setNeedScroll(false);
          }
        }
      },
      [dataRef, inverted, refreshToUI, scrollTo, setNeedScroll]
    )
  );

  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      if (y + heightRef.current > event.nativeEvent.contentSize.height - 10) {
        if (inverted === true) {
          isTopRef.current = true;
        } else {
          isBottomRef.current = true;
        }
      } else {
        if (inverted === true) {
          isTopRef.current = false;
        } else {
          isBottomRef.current = false;
        }
      }
      if (y < 10) {
        if (inverted === true) {
          isBottomRef.current = true;
        } else {
          isTopRef.current = true;
        }
      } else {
        if (inverted === true) {
          isBottomRef.current = false;
        } else {
          isTopRef.current = false;
        }
      }
      if (userScrollGestureRef.current === true) {
        delayExecTask({ ...event });
      }
    },
    [delayExecTask, inverted]
  );

  const onScrollEndDrag = React.useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setUserScrollGesture(false);
    },
    [setUserScrollGesture]
  );
  const onScrollBeginDrag = React.useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setUserScrollGesture(true);
    },
    [setUserScrollGesture]
  );

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    heightRef.current = event.nativeEvent.layout.height;
  }, []);

  const updateMessageVoiceUIState = React.useCallback(
    (model: MessageModel) => {
      const msgId = model.msg.msgId;
      dataRef.current.map((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msgModel.msg.body.type === ChatMessageType.VOICE) {
            if (msgModel.msg.msgId === msgId) {
              msgModel.isVoicePlaying = !msgModel.isVoicePlaying;
            } else {
              msgModel.isVoicePlaying = false;
            }
            d.model = { ...msgModel };
          }
        }
      });
      refreshToUI(dataRef.current);
    },
    [dataRef, refreshToUI]
  );

  const startVoicePlay = React.useCallback(
    async (msgModel: MessageModel) => {
      const isSame =
        msgModel.msg.msgId === currentVoicePlayingRef.current?.msg.msgId;
      if (currentVoicePlayingRef.current) {
        const tmp = currentVoicePlayingRef.current;
        try {
          await Services.ms.stopAudio();
          tmp.isVoicePlaying = true;
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(tmp);
        } catch (error) {
          tmp.isVoicePlaying = true;
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(tmp);
        }
      }

      if (isSame === true) {
        return;
      }

      currentVoicePlayingRef.current = msgModel;
      const tmp = currentVoicePlayingRef.current;
      updateMessageVoiceUIState(msgModel);
      const body = msgModel.msg.body as ChatVoiceMessageBody;
      const localPath = body.localPath;
      try {
        const isExisted = await Services.dcs.isExistedFile(localPath);
        if (isExisted !== true) {
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(msgModel);
          return;
        }

        const readFlag =
          msgModel.msg.attributes?.[gMessageAttributeVoiceReadFlag];
        if (readFlag === undefined) {
          msgModel.msg.attributes = {
            ...msgModel.msg.attributes,
            [gMessageAttributeVoiceReadFlag]: true,
          };
          im.updateMessage({ message: msgModel.msg, onResult: () => {} });
        }

        await Services.ms.playAudio({
          url: LocalPath.playVoice(localPath),
          onPlay({ currentPosition, duration }) {
            if (currentPosition === duration) {
              tmp.isVoicePlaying = true;
              currentVoicePlayingRef.current = undefined;
              updateMessageVoiceUIState(msgModel);
            }
          },
        });
      } catch (error) {
        tmp.isVoicePlaying = true;
        currentVoicePlayingRef.current = undefined;
        updateMessageVoiceUIState(msgModel);
      }
    },
    [im, updateMessageVoiceUIState]
  );

  const recallMessage = React.useCallback(
    (msg: ChatMessage) => {
      im.messageManager.recallMessage(msg);
    },
    [im]
  );

  const showReportMessageMenu = React.useCallback((model: MessageModel) => {
    currentReportMessageRef.current = model;
    reportRef.current?.startShow?.();
  }, []);

  const onDelMessageToUI = React.useCallback(
    (msg: ChatMessage) => {
      const index = dataRef.current.findIndex((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msg.status === ChatMessageStatus.SUCCESS) {
            if (msgModel.msg.msgId === msg.msgId) {
              return true;
            }
          } else {
            if (msgModel.msg.localMsgId === msg.localMsgId) {
              return true;
            }
          }
        }
        return false;
      });
      if (index !== -1) {
        dataRef.current.splice(index, 1);
        if (index === 0) {
          preBottomDataRef.current = dataRef.current[0];
        }
        refreshToUI(dataRef.current);
      }
    },
    [dataRef, refreshToUI]
  );

  const onDelMessageQuoteToUI = React.useCallback(
    (msg: ChatMessage) => {
      const index = dataRef.current.findIndex((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msg.status === ChatMessageStatus.SUCCESS) {
            if (msgModel.quoteMsg?.msgId === msg.msgId) {
              return true;
            }
          } else {
            if (msgModel.quoteMsg?.localMsgId === msg.localMsgId) {
              return true;
            }
          }
        }
        return false;
      });
      if (index !== -1) {
        const item = dataRef.current[index];
        if (item) {
          const msgModel = item.model as MessageModel;
          msgModel.quoteMsg = undefined;
          refreshToUI(dataRef.current);
        }
      }
    },
    [dataRef, refreshToUI]
  );

  const getStyle = React.useCallback(() => {
    return undefined;
  }, []);

  const onAddDataToUI = React.useCallback(
    (d: MessageListItemProps, pos: MessageAddPosition) => {
      if (d.model.modelType === 'message') {
        const msgModel = d.model as MessageModel;
        const user = im.getRequestData(msgModel.msg.from);
        if (user) {
          msgModel.userName = user.name;
          msgModel.userAvatar = user.avatar;
        }
      }
      if (d.model.modelType === 'history') {
        const msgModel = d.model as MessageHistoryModel;
        const user = im.getRequestData(msgModel.msg.from);
        if (user) {
          msgModel.userName = user.name;
          msgModel.userAvatar = user.avatar;
        }
      }
      if (inverted === true) {
        if (pos === 'bottom') {
          dataRef.current = [d, ...dataRef.current];
        } else {
          dataRef.current = [...dataRef.current, d];
        }
      } else {
        if (pos === 'bottom') {
          dataRef.current = [...dataRef.current, d];
        } else {
          dataRef.current = [d, ...dataRef.current];
        }
      }

      refreshToUI(dataRef.current);
    },
    [dataRef, im, inverted, refreshToUI]
  );

  const onAddMessageListToUI = React.useCallback(
    async (
      msgs: ChatMessage[],
      position: MessageAddPosition,
      onFinished?: (items: MessageListItemProps[]) => void
    ) => {
      const tmp = inverted === true ? msgs.reverse() : msgs;
      const list = tmp.map(async (msg) => {
        const getModel = async () => {
          let modelType = 'message';
          if (msg.body.type === ChatMessageType.CUSTOM) {
            const body = msg.body as ChatCustomMessageBody;
            if (body.event === gCustomMessageCardEventType) {
              modelType = 'message';
            } else {
              modelType = 'system';
            }
          }
          if (modelType === 'system') {
            return {
              userId: msg.from,
              modelType: 'system',
              msg: msg,
            } as SystemMessageModel;
          } else {
            const quote = msg.attributes?.[gMessageAttributeQuote];
            let quoteMsg: ChatMessage | undefined;
            if (quote) {
              quoteMsg = await im.getMessage({
                messageId: quote.msgID,
              });
            }
            const user = im.getRequestData(msg.from);
            const threadMsg =
              msg.chatType === ChatMessageChatType.GroupChat &&
              comType === 'chat'
                ? await msg.threadInfo
                : undefined;
            return {
              userId: msg.from,
              modelType: 'message',
              layoutType:
                messageLayoutType ??
                (msg.from === im.userId ? 'right' : 'left'),
              msg: msg,
              quoteMsg: quoteMsg,
              reactions: await msg.reactionList,
              thread: threadMsg,
              userName: user?.name,
              userAvatar: user?.avatar,
              checked: selectType === 'multi' ? false : undefined,
            } as MessageModel;
          }
        };
        return {
          id: msg.msgId.toString(),
          model: await getModel(),
          containerStyle: getStyle(),
        } as MessageListItemProps;
      });
      const l = await Promise.all(list);
      if (inverted === true) {
        if (position === 'bottom') {
          dataRef.current = [...l, ...dataRef.current];
        } else {
          dataRef.current = [...dataRef.current, ...l];
        }
      } else {
        if (position === 'bottom') {
          dataRef.current = [...dataRef.current, ...l];
        } else {
          dataRef.current = [...l, ...dataRef.current];
        }
      }

      refreshToUI(dataRef.current);
      onFinished?.(l as MessageListItemProps[]);
    },
    [
      comType,
      dataRef,
      getStyle,
      im,
      inverted,
      messageLayoutType,
      refreshToUI,
      selectType,
    ]
  );

  const onUpdateMessageToUI = React.useCallback(
    (msg: ChatMessage, fromType: 'send' | 'recv') => {
      const isExisted = dataRef.current.find((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (fromType === 'send') {
            if (msgModel.msg.localMsgId === msg.localMsgId) {
              msgModel.msg = msg;
              d.model = { ...msgModel };
              return true;
            }
          } else {
            if (msgModel.msg.msgId === msg.msgId) {
              msgModel.msg = msg;
              d.model = { ...msgModel };
              return true;
            }
          }
        }
        return false;
      });
      if (isExisted) {
        refreshToUI(dataRef.current);
      }
    },
    [dataRef, refreshToUI]
  );

  const onUpdateMessageThreadToUI = React.useCallback(
    (msgId: string, thread: ChatMessageThread) => {
      if (comType !== 'chat') {
        return;
      }
      const isExisted = dataRef.current.find((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msgModel.msg.msgId === msgId) {
            msgModel.thread = thread;
            d.model = { ...msgModel };
            return true;
          }
        }
        return false;
      });
      if (isExisted) {
        refreshToUI(dataRef.current);
      }
    },
    [comType, dataRef, refreshToUI]
  );

  const onremoveMessageThreadToUI = React.useCallback(
    (msgId: string) => {
      if (comType !== 'chat') {
        return;
      }
      const isExisted = dataRef.current.find((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msgModel.msg.msgId === msgId) {
            msgModel.thread = undefined;
            d.model = { ...msgModel };
            return true;
          }
        }
        return false;
      });
      if (isExisted) {
        refreshToUI(dataRef.current);
      }
    },
    [comType, dataRef, refreshToUI]
  );

  const deleteMessage = React.useCallback(
    (msg: ChatMessage) => {
      im.removeMessage({
        message: msg,
        onResult: () => {
          onDelMessageToUI(msg);
          onDelMessageQuoteToUI(msg);
        },
      });
    },
    [im, onDelMessageQuoteToUI, onDelMessageToUI]
  );

  const deleteMessages = React.useCallback(
    (msgs: ChatMessage[]) => {
      im.removeMessages({ message: msgs })
        .then(() => {
          msgs.forEach((msg) => {
            onDelMessageToUI(msg);
            onDelMessageQuoteToUI(msg);
          });
        })
        .catch();
    },
    [im, onDelMessageQuoteToUI, onDelMessageToUI]
  );

  const translateMessage = React.useCallback(
    (model: MessageModel) => {
      im.translateMessage({
        message: model.msg,
        languages: [languageCode],
        onResult: (result) => {
          if (result.isOk === true && result.value) {
            result.value.attributes = {
              [gMessageAttributeTranslate]: true,
            };
            im.updateMessage({ message: result.value, onResult: () => {} });
            onUpdateMessageToUI(result.value, 'recv');
          }
        },
      });
    },
    [im, languageCode, onUpdateMessageToUI]
  );

  const onCreateThread = React.useCallback(
    (model: MessageModel) => {
      propsOnCreateThread?.({
        newName: 'default_name',
        parentId: convId,
        messageId: model.msg.msgId,
      });
    },
    [convId, propsOnCreateThread]
  );

  const _onClickedLeaveThread = React.useCallback(
    (threadId: string) => {
      if (onClickedLeaveThread) {
        onClickedLeaveThread(threadId);
      } else {
        if (thread) {
          if (thread?.owner === im.userId) {
            im.destroyThread({ threadId: thread.threadId });
          } else {
            im.leaveThread({ threadId: thread.threadId });
          }
        }
      }
    },
    [im, onClickedLeaveThread, thread]
  );

  const _onMultiSelected = React.useCallback(() => {
    onClickedMultiSelected?.();
    dataRef.current.forEach((d) => {
      if (d.model.modelType === 'message') {
        const msgModel = d.model as MessageModel;
        msgModel.checked = false;
      }
    });
    refreshToUI([...dataRef.current]);
    tmpMessageListRef.current = [];
  }, [dataRef, onClickedMultiSelected, refreshToUI]);

  const cancelMultiSelected = React.useCallback(() => {
    dataRef.current.forEach((d) => {
      if (d.model.modelType === 'message') {
        const msgModel = d.model as MessageModel;
        msgModel.checked = undefined;
      }
    });
    refreshToUI([...dataRef.current]);
  }, [dataRef, refreshToUI]);

  const _onForwardMessage = React.useCallback(
    (data: MessageModel) => {
      onClickedSingleSelect?.(data);
    },
    [onClickedSingleSelect]
  );

  const { onShowMessageLongPressActions } = useMessageLongPressActions({
    menuRef,
    alertRef,
    onQuoteMessageForInput: propsOnQuoteMessageForInput,
    onEditMessageForInput: propsOnEditMessageForInput,
    showReportMessage: showReportMessageMenu,
    onDeleteMessage: deleteMessage,
    onRecallMessage: recallMessage,
    onInit: onInitMenu,
    onCopyFinished: propsOnCopyFinished,
    onTranslateMessage: translateMessage,
    onThread: onCreateThread,
    onClickedMultiSelected: _onMultiSelected,
    onForwardMessage: _onForwardMessage,
  });

  const { onShowEmojiLongPressActions } = useEmojiLongPressActionsProps({
    menuRef: emojiRef,
  });

  const { onShowMessageThreadListMoreActions } =
    useMessageThreadListMoreActions({
      menuRef,
      alertRef,
      onClickedEditThreadName,
      onClickedLeaveThread: _onClickedLeaveThread,
      onClickedOpenThreadMemberList,
    });

  const onClickedListItem = React.useCallback(
    async (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      const ret = propsOnClicked?.(id, model);
      if (ret !== false) {
        if (model.modelType === 'message') {
          const msgModel = model as MessageModel;
          if (msgModel.msg.body.type === ChatMessageType.VOICE) {
            startVoicePlay(msgModel);
          } else if (msgModel.msg.body.type === ChatMessageType.COMBINE) {
            onClickedHistoryDetail?.(msgModel);
          }
        }
      }
    },
    [onClickedHistoryDetail, propsOnClicked, startVoicePlay]
  );

  const onCheckedItem = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType === 'message') {
        const isExisted = dataRef.current.find((d) => {
          if (d.id === id) {
            const msgModel = d.model as MessageModel;
            d.model = { ...msgModel, checked: !msgModel.checked };
            return true;
          }
          return false;
        });
        if (isExisted) {
          refreshToUI([...dataRef.current]);
        }

        if (onChangeMultiItems) {
          const list = dataRef.current
            .filter((d) => {
              if (d.model.modelType === 'message') {
                const msgModel = d.model as MessageModel;
                if (msgModel.checked === true) {
                  return true;
                }
              }
              return false;
            })
            .map((d) => {
              return d.model as MessageModel;
            });
          tmpMessageListRef.current = list;
          onChangeMultiItems(list);
        }
      }
    },
    [dataRef, onChangeMultiItems, refreshToUI]
  );

  const updateMessageEmojiToUI = React.useCallback(
    (msg: ChatMessage, reaction: ChatMessageReaction) => {
      const item = dataRef.current.find((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msgModel.msg.msgId === msg.msgId) {
            return true;
          }
        }
        return false;
      });
      if (item) {
        const msgModel = item.model as MessageModel;
        if (!msgModel.reactions) {
          msgModel.reactions = [];
        }
        if (msgModel.reactions) {
          const index = msgModel.reactions.findIndex(
            (d) => d.reaction === reaction.reaction
          );
          if (index !== -1) {
            const r = msgModel.reactions[index];
            if (r) {
              if (reaction.count > 0) {
                msgModel.reactions[index] = reaction;
              } else {
                msgModel.reactions.splice(index, 1);
              }
            }
          } else {
            msgModel.reactions.push(reaction);
          }
          refreshToUI(dataRef.current);
        }
      }
    },
    [dataRef, refreshToUI]
  );

  const onEmojiClicked = React.useCallback(
    (face: string, model: MessageModel) => {
      im.getMessageReactionsList({
        msgId: model.msg.msgId,
        onResult: (result) => {
          if (result.isOk && result.value) {
            const reactions = result.value;
            const isExisted = reactions.find((d) => {
              if (d.reaction === face) {
                return true;
              }
              return false;
            });
            if (isExisted && isExisted.isAddedBySelf === true) {
              im.removeReactionFromMessage({
                msgId: model.msg.msgId,
                reaction: face,
                onResult: () => {
                  // removeMessageEmojiFromUI(model.msg, face);
                },
              });
            } else if (isExisted && isExisted.isAddedBySelf === false) {
              im.addReactionToMessage({
                msgId: model.msg.msgId,
                reaction: face,
                onResult: () => {
                  // AddMessageEmojiToUI(model.msg, face);
                },
              });
            } else if (!isExisted) {
              im.addReactionToMessage({
                msgId: model.msg.msgId,
                reaction: face,
                onResult: () => {
                  // AddMessageEmojiToUI(model.msg, face);
                },
              });
            }
          }
        },
      });
    },
    [im]
  );

  const getEmojiState = React.useCallback(
    (
      list: EmojiIconItem[],
      msgId: string,
      onFinished: (list?: EmojiIconItem[]) => void
    ) => {
      im.getMessageReactionsList({
        msgId,
        onResult: (result) => {
          if (result.isOk && result.value) {
            const reactions = result.value;
            list.forEach((d) => {
              const isExisted = reactions.find((r) => {
                if (r.reaction === d.name) {
                  return true;
                }
                return false;
              });
              if (isExisted) {
                d.state = isExisted.isAddedBySelf ? 'selected' : 'common';
              } else {
                d.state = 'common';
              }
            });
            onFinished(list);
          } else {
            onFinished();
          }
        },
      });
    },
    [im]
  );

  const onLongPressListItem = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (selectType === 'multi') {
        return;
      }
      const ret = propsOnLongPress?.(id, model);
      if (ret !== false) {
        if (model.modelType === 'message') {
          const list = emojiListRef.current.slice(0, 6);
          const onFace = (face: string) => {
            if (face === 'faceplus') {
              menuRef.current?.startHide?.(() => {
                const list = emojiListRef.current;
                getEmojiState(list, msgModel.msg.msgId, (updateList) => {
                  if (updateList) {
                    msgModelRef.current = model as MessageModel;
                    const onFace = (face: string) => {
                      emojiRef.current?.startHide?.(() => {
                        onEmojiClicked(face, model as MessageModel);
                      });
                    };
                    onShowEmojiLongPressActions(updateList, onFace);
                  }
                });
              });
            } else {
              menuRef.current?.startHide?.(() => {
                onEmojiClicked(face, model as MessageModel);
              });
            }
          };
          const msgModel = model as MessageModel;
          getEmojiState(list, msgModel.msg.msgId, (updateList) => {
            if (updateList) {
              onShowMessageLongPressActions(id, model, updateList, onFace);
            } else {
              onShowMessageLongPressActions(id, model);
            }
          });
        }
      }
    },
    [
      getEmojiState,
      onEmojiClicked,
      onShowEmojiLongPressActions,
      onShowMessageLongPressActions,
      propsOnLongPress,
      selectType,
    ]
  );

  const onClickedListItemAvatar = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      propsOnClickedItemAvatar?.(id, model);
    },
    [propsOnClickedItemAvatar]
  );

  const onClickedListItemQuote = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      const ret = propsOnClickedItemQuote?.(id, model);
      if (ret !== false) {
        const item = dataRef.current.find((d) => {
          if (d.id === id) {
            return true;
          }
          return false;
        });
        if (item && item.index !== undefined) {
          scrollTo(item.index, false);
        }
      }
    },
    [dataRef, propsOnClickedItemQuote, scrollTo]
  );

  const msgModelRef = React.useRef({} as MessageModel);
  const onClickedFaceListItem = React.useCallback(
    (face: string) => {
      emojiRef.current?.startHide?.(() => {
        onEmojiClicked(face, msgModelRef.current);
      });
    },
    [onEmojiClicked]
  );

  const onClickedListItemReaction = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel,
      face: string
    ) => {
      if (model.modelType === 'message') {
        if (face === 'faceplus') {
          const msgModel = model as MessageModel;
          if (msgModel.reactions && msgModel.reactions?.length > 0) {
            reactionRef.current?.startShowWithProps?.({
              reactionList: msgModel.reactions,
              msgId: msgModel.msg.msgId,
              onRequestModalClose: onRequestCloseReaction,
            });
          }
        } else {
          onEmojiClicked(face, model as MessageModel);
        }
      }
    },
    [onEmojiClicked, onRequestCloseReaction]
  );

  const onClickedListItemThread = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType === 'message') {
        const msgModel = model as MessageModel;
        if (msgModel.thread) {
          if (msgModel.thread.msgId.length === 0) {
            // !!! fix bug.
            im.fetchThread({
              threadId: msgModel.thread.threadId,
              onResult: (res) => {
                if (res.isOk && res.value) {
                  const thread = { ...msgModel.thread, ...res.value };
                  propsOnOpenThread?.(thread);
                }
              },
            });
          } else {
            propsOnOpenThread?.(msgModel.thread);
          }
        }
      }
    },
    [im, propsOnOpenThread]
  );

  const reportMessage = React.useCallback(
    (result?: ReportItemModel) => {
      if (result) {
        const msg = currentReportMessageRef.current?.msg;
        if (msg) {
          im.reportMessage({
            messageId: msg.msgId,
            tag: result.tag,
            reason: tr(result.title),
            onResult: () => {
              currentReportMessageRef.current = undefined;
              reportRef.current?.startHide?.();
            },
          });
        }
      }
    },
    [im, tr]
  );

  const resendMessage = React.useCallback(
    (msg: ChatMessage) => {
      if (msg.direction !== ChatMessageDirection.SEND) {
        return;
      }
      const tmp = { ...msg } as ChatMessage;
      tmp.status = ChatMessageStatus.CREATE;
      onUpdateMessageToUI(tmp, 'send');
      im.messageManager.resendMessage(tmp);
    },
    [im.messageManager, onUpdateMessageToUI]
  );

  const onClickedListItemState = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType !== 'message') {
        return;
      }
      const msgModel = model as MessageModel;
      if (msgModel.msg.status === ChatMessageStatus.FAIL) {
        resendMessage(msgModel.msg);
      }
    },
    [resendMessage]
  );

  const editMessage = React.useCallback(
    (msg: ChatMessage) => {
      im.editMessage({
        message: msg,
        onResult: (result) => {
          if (result.isOk === true && result.value) {
            onUpdateMessageToUI(result.value, 'recv');
          } else {
            im.sendError({ error: result.error!, from: 'editMessage' });
          }
        },
      });
    },
    [im, onUpdateMessageToUI]
  );

  const onAddMessageToUI = React.useCallback(
    async (msg: ChatMessage) => {
      let quoteMsg: ChatMessage | undefined;
      const quoteAttributes = getQuoteAttribute(msg);
      if (quoteAttributes) {
        quoteMsg = await im.getMessage({
          messageId: quoteAttributes.msgID,
        });
      }
      let threadMsg: ChatMessageThread | undefined;
      if (
        msg.chatType === ChatMessageChatType.GroupChat &&
        comType === 'chat'
      ) {
        threadMsg = await msg.threadInfo;
      }
      if (
        (comType === 'thread' || comType === 'create_thread') &&
        msg.isChatThread !== true
      ) {
        onAddDataToUI(
          {
            id: msg.msgId.toString(),
            model: {
              userId: msg.from,
              modelType: 'history',
              msg: msg,
              checked: selectType === 'multi' ? false : undefined,
            },
            containerStyle: getStyle(),
          },
          inverted === true ? 'bottom' : 'top'
        );
      } else {
        onAddDataToUI(
          {
            id: msg.msgId.toString(),
            model: {
              userId: msg.from,
              modelType: 'message',
              layoutType: msg.from === im.userId ? 'right' : 'left',
              msg: msg,
              quoteMsg: quoteMsg,
              thread: threadMsg,
              checked: selectType === 'multi' ? false : undefined,
            },
            containerStyle: getStyle(),
          },
          inverted === true ? 'bottom' : 'top'
        );
      }
      scrollToBottom(true);
    },
    [comType, scrollToBottom, im, onAddDataToUI, selectType, getStyle, inverted]
  );

  const onRecallMessageToUI = React.useCallback(
    (tipMsg: ChatMessage) => {
      onAddDataToUI(
        {
          id: tipMsg.msgId.toString(),
          model: {
            userId: tipMsg.from,
            modelType: 'system',
            msg: tipMsg,
          } as SystemMessageModel,
          containerStyle: getStyle(),
        },
        inverted === true ? 'bottom' : 'top'
      );
    },
    [getStyle, inverted, onAddDataToUI]
  );

  const onRecvRecallMessage = React.useCallback(
    (orgMsg: ChatMessage, tipMsg: ChatMessage) => {
      onDelMessageToUI(orgMsg);
      onDelMessageQuoteToUI(orgMsg);
      onRecallMessageToUI(tipMsg);
    },
    [onDelMessageQuoteToUI, onDelMessageToUI, onRecallMessageToUI]
  );

  const sendRecvMessageReadAck = React.useCallback(
    (msg: ChatMessage) => {
      if (
        msg.chatType === ChatMessageChatType.PeerChat &&
        msg.direction === ChatMessageDirection.RECEIVE &&
        msg.hasReadAck === false
      ) {
        im.messageManager.sendMessageReadAck({
          message: msg,
        });
      }
    },
    [im]
  );

  // todo: how to do?
  // const setRecvMessageRead = React.useCallback(
  //   (msg: ChatMessage) => {
  //     if (
  //       msg.chatType === ChatMessageChatType.PeerChat &&
  //       msg.direction === ChatMessageDirection.RECEIVE &&
  //       msg.hasRead === false
  //     ) {
  //       im.messageManager.setMessageRead({
  //         convId: convId,
  //         convType: convType,
  //         message: msg,
  //       });
  //     }
  //   },
  //   [convId, convType, im.messageManager]
  // );

  const addSendMessageToUI = React.useCallback(
    (
      value:
        | SendFileProps
        | SendImageProps
        | SendTextProps
        | SendVideoProps
        | SendVoiceProps
        | SendTimeProps
        | SendSystemProps
        | SendCardProps
        | SendCustomProps,

      onFinished?: (item: MessageListItemProps) => void
    ) => {
      let ret: MessageListItemProps | undefined;
      if (value.type === 'text') {
        const v = value as SendTextProps;
        const msg = ChatMessage.createTextMessage(
          convId,
          // emoji.fromCodePointText(v.content),
          v.content,
          convType as number as ChatMessageChatType,
          {
            isChatThread: comType === 'thread',
          }
        );
        const quoteMsg = value.quote?.msg;
        if (quoteMsg) {
          msg.attributes = {
            [gMessageAttributeQuote]: {
              msgID: quoteMsg.msgId,
              msgPreview: (quoteMsg.body as ChatTextMessageBody).content,
              msgSender: quoteMsg.from,
              msgType: quoteMsg.body.type,
            },
          };
        }
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            quoteMsg: quoteMsg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
      } else if (value.type === 'image') {
        const v = value as SendImageProps;
        const msg = ChatMessage.createImageMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
            isChatThread: comType === 'thread',
            width: v.imageWidth,
            height: v.imageHeight,
            fileSize: v.fileSize,
            displayName: v.displayName ?? '',
          }
        );
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'voice') {
        const v = value as SendVoiceProps;
        const msg = ChatMessage.createVoiceMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
            isChatThread: comType === 'thread',
            duration: Math.round((v.duration ?? 0) / 1000),
            fileSize: v.fileSize,
            displayName: v.displayName ?? '',
          }
        );
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'video') {
        const v = value as SendVideoProps;
        const msg = ChatMessage.createVideoMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
            isChatThread: comType === 'thread',
            duration: v.duration ?? 0,
            fileSize: v.fileSize,
            displayName: v.displayName ?? '',
            thumbnailLocalPath: v.thumbLocalPath,
            width: v.videoWidth,
            height: v.videoHeight,
          }
        );
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'file') {
        const v = value as SendFileProps;
        const msg = ChatMessage.createFileMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
            isChatThread: comType === 'thread',
            fileSize: v.fileSize,
            displayName: v.displayName ?? '',
          }
        );
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'card') {
        const card = value as SendCardProps;
        const msg = ChatMessage.createCustomMessage(
          convId,
          gCustomMessageCardEventType,
          convType as number as ChatMessageChatType,
          {
            isChatThread: comType === 'thread',
            params: {
              userId: card.userId,
              nickname: im.getRequestData(card.userId)?.name ?? card.userId,
              avatar: im.getRequestData(card.userId)?.avatar!,
            },
          }
        );
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'custom') {
        const custom = value as SendCustomProps;
        const msg = custom.msg;
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'system') {
        const v = value as SendSystemProps;
        const msg = v.msg;
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'system',
            msg: msg,
          } as SystemMessageModel,
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      } else if (value.type === 'time') {
        const v = value as SendTimeProps;
        ret = {
          id: v.timestamp.toString(),
          model: {
            userId: seqId('_$msg').toString(),
            modelType: 'time',
          } as TimeMessageModel,
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, inverted === true ? 'bottom' : 'top');
      }
      if (ret) {
        onFinished?.(ret);
        scrollToBottom();
      }
    },
    [
      comType,
      convId,
      convType,
      getStyle,
      im,
      inverted,
      messageLayoutType,
      onAddDataToUI,
      scrollToBottom,
      selectType,
    ]
  );

  const sendMessageToServer = React.useCallback(
    (msg: ChatMessage) => {
      im.messageManager.sendMessage(msg);
    },
    [im]
  );

  const init = React.useCallback(async () => {
    console.log('dev:MessageList:', convId, convType);
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      setNeedScroll(true);
      setUserScrollGesture(false);
      currentVoicePlayingRef.current = undefined;
      startMsgIdRef.current = '';
      hasNoMoreRef.current = false;
      dataRef.current = [];
      im.messageManager.setRecallMessageTimeout(recallTimeout);
      refreshToUI(dataRef.current);
    }
  }, [
    convId,
    convType,
    dataRef,
    im.messageManager,
    isAutoLoad,
    recallTimeout,
    refreshToUI,
    setNeedScroll,
    setUserScrollGesture,
    testMode,
  ]);

  const onContentSizeChange = React.useCallback((_w: number, _h: number) => {},
  []);

  const requestThreadHeaderMessage = React.useCallback(async () => {
    let messageId;
    if (comType === 'create_thread') {
      messageId = msgId;
    } else if (comType === 'thread') {
      messageId = thread?.msgId;
    }
    if (!messageId) {
      return;
    }

    if (msgId || thread) {
      const msg = await im.getMessage({ messageId: messageId });
      if (msg) {
        onAddMessageToUI(msg);
      }
    }
  }, [comType, im, onAddMessageToUI, thread, msgId]);

  const requestThreadHistoryMessage = React.useCallback(async () => {
    if (hasNoMoreRef.current === true) {
      onNoMoreMessage?.();
      return;
    }
    if (startMsgIdRef.current === '') {
      if (thread && thread.owner !== im.userId) {
        im.joinThread({
          threadId: convId,
          onResult: (res) => {
            console.log('dev:joinThread:', res);
          },
        });
      }

      await requestThreadHeaderMessage();
    }

    // im.messageManager.loadHistoryMessage({
    //   convId,
    //   convType,
    //   startMsgId: startMsgIdRef.current,
    //   loadCount: gRequestMaxMessageCount,
    //   direction: ChatSearchDirection.DOWN,
    //   isChatThread: true,
    //   onResult: (msgs) => {
    //     if (msgs.length < gRequestMaxMessageCount) {
    //       hasNoMoreRef.current = true;
    //     }
    //     if (msgs.length > 0) {
    //       const newStartMsgId = msgs[msgs.length - 1]!.msgId.toString();
    //       if (newStartMsgId === startMsgIdRef.current) {
    //         return;
    //       }
    //       startMsgIdRef.current = msgs[msgs.length - 1]!.msgId.toString();
    //       if (comType === 'thread') {
    //         setNeedScroll(true);
    //       }
    //       onAddMessageListToUI(msgs, 'bottom', () => {});
    //     }
    //   },
    // });

    // !!! bug for local message ID.
    im.fetchHistoryMessages({
      convId,
      convType,
      startMsgId: startMsgIdRef.current,
      direction: ChatSearchDirection.DOWN,
      pageSize: gRequestMaxMessageCount,
      onResult: (res) => {
        if (res.isOk && res.value && res.value.list) {
          if (res.value.list.length === 0 && startMsgIdRef.current === '') {
            if (firstMessage) {
              addSendMessageToUI(firstMessage, (item) => {
                if (item.model.modelType === 'message') {
                  const msgModel = item.model as MessageModel;
                  sendMessageToServer(msgModel.msg);
                }
              });
            }
          } else {
            const msgs = res.value.list;
            startMsgIdRef.current = res.value.cursor;
            if (msgs.length < gRequestMaxMessageCount) {
              hasNoMoreRef.current = true;
            }
            if (msgs.length > 0) {
              if (comType === 'thread') {
                setNeedScroll(true);
              }
              onAddMessageListToUI(msgs, 'bottom', () => {});
            }
          }
        }
      },
    });
  }, [
    addSendMessageToUI,
    comType,
    convId,
    convType,
    firstMessage,
    im,
    onAddMessageListToUI,
    onNoMoreMessage,
    requestThreadHeaderMessage,
    sendMessageToServer,
    setNeedScroll,
    thread,
  ]);

  const requestHistoryMessage = React.useCallback(() => {
    if (comType === 'create_thread') {
      requestThreadHeaderMessage();
      return;
    }
    if (comType === 'thread') {
      requestThreadHistoryMessage();
      return;
    }
    if (hasNoMoreRef.current === true) {
      onNoMoreMessage?.();
      return;
    }
    im.messageManager.loadHistoryMessage({
      convId,
      convType,
      startMsgId: startMsgIdRef.current,
      loadCount: gRequestMaxMessageCount,
      onResult: (msgs) => {
        if (msgs.length < gRequestMaxMessageCount) {
          hasNoMoreRef.current = true;
        }
        if (msgs.length > 0) {
          const newStartMsgId = msgs[0]!.msgId.toString();
          if (newStartMsgId === startMsgIdRef.current) {
            return;
          }
          startMsgIdRef.current = msgs[0]!.msgId.toString();
          onAddMessageListToUI(
            msgs,
            inverted === true ? 'top' : 'bottom',
            (list) => {
              list.map((v) => {
                if (v.model.modelType === 'message') {
                  const msgModel = v.model as MessageModel;
                  sendRecvMessageReadAck(msgModel.msg);
                }
              });
            }
          );
        }
      },
    });
  }, [
    convId,
    convType,
    im.messageManager,
    inverted,
    onAddMessageListToUI,
    onNoMoreMessage,
    requestThreadHeaderMessage,
    requestThreadHistoryMessage,
    sendRecvMessageReadAck,
    comType,
  ]);

  const _onRefresh = React.useCallback(() => {
    setRefreshing?.(true);
    requestHistoryMessage();
    setTimeout(() => {
      setRefreshing?.(false);
    }, 100);
  }, [requestHistoryMessage]);

  const _onMore = React.useCallback(() => {
    requestHistoryMessage();
  }, [requestHistoryMessage]);

  const createThread = React.useCallback(
    (onResult: ResultCallback<ChatMessageThread>) => {
      if (msgId && parentId) {
        im.createThread({
          name: newThreadName ?? 'default_name',
          msgId: msgId,
          parentId: parentId,
          onResult: onResult,
        });
      }
    },
    [im, msgId, newThreadName, parentId]
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        addSendMessage: (
          value:
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
          if (comType === 'create_thread') {
            createThread((res) => {
              if (res.isOk === true && res.value) {
                onCreateThreadResult?.(res.value, value);
              } else {
                onCreateThreadResult?.();
              }
            });
            return;
          }
          setNeedScroll(true);
          addSendMessageToUI(value, (item) => {
            if (item.model.modelType === 'message') {
              const msgModel = item.model as MessageModel;
              sendMessageToServer(msgModel.msg);
            }
          });
        },
        removeMessage: (msg: ChatMessage) => {
          deleteMessage(msg);
        },
        recallMessage: (msg: ChatMessage) => {
          recallMessage(msg);
        },
        updateMessage: (updatedMsg: ChatMessage, fromType: 'send' | 'recv') => {
          onUpdateMessageToUI(updatedMsg, fromType);
        },
        loadHistoryMessage: (msgs: ChatMessage[], pos: MessageAddPosition) => {
          if (pos === 'top') {
            if (msgs.length > 0) {
              if (startMsgIdRef.current === msgs[0]?.msgId) {
                return;
              }
              startMsgIdRef.current = msgs[0]!.msgId.toString();
            }
          }
          onAddMessageListToUI(msgs, pos, (list) => {
            list.map((v) => {
              if (v.model.modelType === 'message') {
                const msgModel = v.model as MessageModel;
                sendRecvMessageReadAck(msgModel.msg);
              }
            });
          });
        },
        onInputHeightChange: (height: number) => {
          if (inverted === false) {
            if (height > 0) {
              scrollToBottom();
            }
          }
        },
        editMessageFinished: (model) => {
          editMessage(model.msg);
        },
        scrollToBottom: () => {
          setNeedScroll(true);
          refreshToUI(dataRef.current);
          scrollToBottom();
        },
        startShowThreadMoreMenu: () => {
          if (thread) {
            onShowMessageThreadListMoreActions(thread);
          }
        },
        cancelMultiSelected: () => {
          cancelMultiSelected();
        },
        removeMultiSelected: (onResult: (confirmed: boolean) => void) => {
          alertRef.current?.alertWithInit({
            message: tr('_uikit_alert_remove_message'),
            buttons: [
              {
                text: 'cancel',
                onPress: () => {
                  alertRef.current?.close?.();
                  onResult(false);
                },
              },
              {
                text: 'confirm',
                isPreferred: true,
                onPress: () => {
                  alertRef.current?.close?.();
                  deleteMessages(tmpMessageListRef.current.map((d) => d.msg));
                  onResult(true);
                },
              },
            ],
          });
        },
        getMultiSelectedMessages: () => {
          return tmpMessageListRef.current.map((d) => d.msg);
        },
      };
    },
    [
      addSendMessageToUI,
      cancelMultiSelected,
      comType,
      createThread,
      dataRef,
      deleteMessage,
      deleteMessages,
      editMessage,
      inverted,
      onAddMessageListToUI,
      onCreateThreadResult,
      onShowMessageThreadListMoreActions,
      onUpdateMessageToUI,
      recallMessage,
      refreshToUI,
      scrollToBottom,
      sendMessageToServer,
      sendRecvMessageReadAck,
      setNeedScroll,
      thread,
      tr,
    ]
  );

  React.useEffect(() => {
    const uiListener: UIConversationListListener = {
      onDeletedEvent: (data) => {
        if (data.convId === convId) {
          dataRef.current = [];
          refreshToUI(dataRef.current);
        }
      },
      onRequestRefreshEvent: (id) => {
        if (id === convId) {
          refreshToUI(dataRef.current);
        }
      },
      onRequestReloadEvent: (id) => {
        if (id === convId) {
          init();
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [convId, dataRef, im, init, refreshToUI]);

  React.useEffect(() => {
    const listener = {
      onSendMessageChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'send');
      },
      onRecvMessage: async (msg: ChatMessage) => {
        if (msg.conversationId === convId) {
          if (recvMessageAutoScroll === true) {
            setNeedScroll(true);
          }
          onAddMessageToUI(msg);
          sendRecvMessageReadAck(msg);
        }
      },
      onRecvMessageStatusChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'recv');
      },
      onRecvMessageContentChanged: (msg: ChatMessage, _byUserId: string) => {
        onUpdateMessageToUI(msg, 'recv');
      },
      onRecvRecallMessage: (orgMsg: ChatMessage, tipMsg: ChatMessage) => {
        if (orgMsg.conversationId === convId) {
          if (recvMessageAutoScroll === true) {
            setNeedScroll(true);
          }
          onRecvRecallMessage(orgMsg, tipMsg);
        }
      },
      onRecallMessageResult: (params: {
        isOk: boolean;
        orgMsg?: ChatMessage;
        tipMsg?: ChatMessage;
      }) => {
        if (params.isOk === true) {
          if (params.orgMsg && params.tipMsg) {
            if (params.orgMsg.conversationId === convId) {
              if (recvMessageAutoScroll === true) {
                setNeedScroll(true);
              }
              onRecvRecallMessage(params.orgMsg, params.tipMsg);
            }
          }
        }
      },
    } as MessageManagerListener;
    im.messageManager.addListener(convId, listener);
    return () => {
      im.messageManager.removeListener(convId);
    };
  }, [
    convId,
    im,
    onAddMessageToUI,
    onRecvRecallMessage,
    onUpdateMessageToUI,
    recvMessageAutoScroll,
    sendRecvMessageReadAck,
    setNeedScroll,
  ]);

  React.useEffect(() => {
    const listener = {
      onMessageReactionDidChange: (list: Array<ChatMessageReactionEvent>) => {
        for (const item of list) {
          item.operations.forEach(async (op) => {
            const msg = await im.getMessage({ messageId: item.msgId });
            if (msg) {
              const isExisted = item.reactions.find((d) => {
                if (d.reaction === op.reaction) {
                  return true;
                }
                return false;
              });
              // removeMessageEmojiFromUI(msg, op.reaction);
              if (isExisted) {
                updateMessageEmojiToUI(msg, isExisted);
              }
            }
          });
        }
      },
      onChatMessageThreadCreated: (event: ChatMessageThreadEvent) => {
        const msgId = event.thread.msgId;
        if (msgId) {
          onUpdateMessageThreadToUI(msgId, event.thread);
        }
      },
      onChatMessageThreadUpdated: (event: ChatMessageThreadEvent) => {
        const msgId = event.thread.msgId;
        if (msgId) {
          onUpdateMessageThreadToUI(msgId, event.thread);
        }
      },
      onChatMessageThreadDestroyed: (event: ChatMessageThreadEvent) => {
        const msgId = event.thread.msgId;
        if (msgId) {
          onremoveMessageThreadToUI(msgId);
        }
      },
      onChatMessageThreadUserRemoved: (_event: ChatMessageThreadEvent) => {},
    } as MessageServiceListener;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [
    im,
    onUpdateMessageThreadToUI,
    onremoveMessageThreadToUI,
    updateMessageEmojiToUI,
  ]);

  React.useEffect(() => {
    init();
    requestHistoryMessage();
  }, [convId, convType, im.messageManager, init, requestHistoryMessage]);

  return {
    ...flatListProps,
    listType,
    listState,
    onRequestCloseMenu: closeMenu,
    menuRef,
    alertRef,
    onClickedItem: onClickedListItem,
    onLongPressItem: onLongPressListItem,
    inverted,
    maxListHeight,
    setMaxListHeight,
    reachedThreshold,
    refreshing: enableRefresh === true ? refreshing : undefined,
    onRefresh: enableRefresh === true ? _onRefresh : undefined,
    onMore: enableMore === true ? _onMore : undefined,
    reportMessage: reportMessage,
    showReportMessage: showReportMessageMenu,
    reportData: reportDataRef.current,
    reportRef,
    onClickedItemAvatar: onClickedListItemAvatar,
    onClickedItemQuote: onClickedListItemQuote,
    onClickedItemState: onClickedListItemState,
    onClickedItemReaction: onClickedListItemReaction,
    onClickedItemThread: onClickedListItemThread,
    ListItemRender: MessageListItemRef.current,
    listItemRenderProps: listItemRenderPropsRef.current,
    scrollEventThrottle,
    onMomentumScrollEnd,
    onScrollEndDrag,
    onScrollBeginDrag,
    onScroll,
    onLayout,
    bounces,
    onContentSizeChange,
    onRenderItem,
    emojiRef,
    onRequestCloseEmoji,
    emojiList: emojiListRef.current,
    onClickedFaceListItem,
    reactionRef,
    onRequestCloseReaction,
    onCheckedItem,
  };
}
