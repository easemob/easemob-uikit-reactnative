import * as React from 'react';
import type {
  GestureResponderEvent,
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
import emoji from 'twemoji';

import { FACE_ASSETS } from '../../assets';
import {
  DataModel,
  gCustomMessageCardEventType,
  gCustomMessageCreateThreadTip,
  gMessageAttributeQuote,
  gMessageAttributeTranslate,
  gMessageAttributeVoiceReadFlag,
  MessageServiceListener,
  ResultCallback,
  setUserInfoToMessage,
  UIConversationListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { useDelayExecTask } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { LocalPath, seqId, timeoutTask } from '../../utils';
import type { BottomSheetEmojiListRef } from '../BottomSheetEmojiList/BottomSheetEmojiList';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type {
  BottomSheetReactionDetailRef,
  MessageReactionModel,
} from '../BottomSheetReactionDetail';
import { gReportMessageList } from '../const';
import { useMessageContext } from '../Context';
import { useDataPriority, useMessageThreadListMoreActions } from '../hooks';
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
import { gRequestMaxMessageCount, gRequestMaxThreadCount } from './const';
import { MessageListItemMemo } from './MessageListItem';
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
    msgId: propsMsgId,
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
    onClickedDestroyThread,
    onClickedOpenThreadMemberList,
    onClickedMultiSelected,
    selectType,
    onChangeMultiItems,
    onClickedSingleSelect,
    onClickedHistoryDetail,
    onChangeUnreadCount,
  } = props;
  const inverted = React.useRef(
    comType === 'chat' || comType === 'search' ? true : false
  ).current;
  // console.log('test:zuoyu:useMessageList', props);

  const enableRefresh =
    comType === 'chat' ||
    comType === 'search' ||
    comType === 'create_thread' ||
    comType === 'thread'
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

  // const [refreshing, setRefreshing] = React.useState(false);
  const preBottomDataRef = React.useRef<MessageListItemProps>();
  const scrollEventThrottle = React.useRef(16).current;
  const userScrollGestureRef = React.useRef(false);
  const isBottomRef = React.useRef(false);
  const isTopRef = React.useRef(false);
  const heightRef = React.useRef(0);
  const bounces = React.useRef(true).current;
  const currentVoicePlayingRef = React.useRef<MessageModel | undefined>();
  const { tr } = useI18nContext();
  const im = useChatContext();
  const startMsgIdRef = React.useRef('');
  const beforeMsgIdRef = React.useRef('');
  const afterMsgIdRef = React.useRef('');
  const [maxListHeight, setMaxListHeight] = React.useState<number>(0);
  const tmpMessageListRef = React.useRef<MessageModel[]>([]);
  const unreadCountRef = React.useRef(0);
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
  const hasNoMoreRef = React.useRef(false); // !!! deprecated, use hasNoOldMsgRef and hasNoNewMsgRef
  const hasNoOldMsgRef = React.useRef(false);
  const hasNoNewMsgRef = React.useRef(false);
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
  const { getMsgInfo, getContactInfo } = useDataPriority({});
  const { recallTimeout, languageCode, enableThread } = useConfigContext();
  const setUserScrollGesture = React.useCallback((isUserScroll: boolean) => {
    userScrollGestureRef.current = isUserScroll;
  }, []);
  const { addListener, removeListener } = useDispatchContext();
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

  const setIsTop = React.useCallback((isTop: boolean) => {
    // console.log('test:zuoyu:setIsTop:', isTop, comType);
    isTopRef.current = isTop;
  }, []);
  const setIsBottom = React.useCallback((isBottom: boolean) => {
    // console.log('test:zuoyu:setIsBottom:', isBottom, comType);
    isBottomRef.current = isBottom;
  }, []);

  const setNoNewMsg = React.useCallback((noNewMsg: boolean) => {
    // console.log('test:zuoyu:setNoNewMsg:', noNewMsg);
    hasNoNewMsgRef.current = noNewMsg;
  }, []);
  const setNoOldMsg = React.useCallback((noOldMsg: boolean) => {
    // console.log('test:zuoyu:setNoOldMsg:', noOldMsg);
    hasNoOldMsgRef.current = noOldMsg;
  }, []);

  const canAddNewMessageToUI = React.useCallback(() => {
    // console.log(
    //   'test:zuoyu:canAddNewMessageToUI:',
    //   hasNoNewMsgRef.current,
    //   isBottomRef.current
    // );
    if (hasNoNewMsgRef.current === true && isBottomRef.current === true) {
      return true;
    }
    return false;
  }, []);

  const createMessageTip = React.useCallback(
    (params: {
      convId: string;
      convType: number;
      event: string;
    }): ChatMessage => {
      const { convId, convType, event } = params;
      const tipMsg = ChatMessage.createCustomMessage(convId, event, convType, {
        params: {
          create_group: JSON.stringify({
            text: '_uikit_msg_tip_create_group_success_with_params',
            self: im.userId,
          }),
        },
        isChatThread: comType === 'thread',
      });
      const s = im.user(im.userId);
      setUserInfoToMessage({ msg: tipMsg, user: s });
      return tipMsg;
    },
    [comType, im]
  );

  // const needScrollToBottom = React.useCallback(() => {
  //   return true;
  //   // if (comType === 'thread') {
  //   //   return true;
  //   // }
  //   // if (needScrollRef.current === true) {
  //   //   return true;
  //   // }
  //   // return false;
  // }, []);

  const setUnreadCount = React.useCallback(
    (count: number) => {
      if (comType === 'chat' || comType === 'search') {
        unreadCountRef.current = count;
        onChangeUnreadCount?.(count);
      }
    },
    [comType, onChangeUnreadCount]
  );

  const scrollToBottom = React.useCallback(
    (animated?: boolean) => {
      timeoutTask(0, () => {
        if (inverted === true) {
          listRef?.current?.scrollToIndex?.({ index: 0, animated });
        } else {
          listRef?.current?.scrollToEnd?.();
        }
      });
      setIsBottom(true);
      setUnreadCount(0);
    },
    [inverted, listRef, setIsBottom, setUnreadCount]
  );

  const scrollTo = React.useCallback(
    (index: number, animated?: boolean) => {
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
          // console.log('test:zuoyu:onRenderItem', d.id, info.item.index);
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
      if (dataRef.current.length > 0) {
        if (inverted === true) {
          preBottomDataRef.current = dataRef.current[0];
        } else {
          preBottomDataRef.current =
            dataRef.current[dataRef.current.length - 1];
        }
      }
      _refreshToUI(dataRef.current);
    },
    [dataRef, removeDuplicateData, _refreshToUI, inverted]
  );

  // const refreshToUI = React.useCallback(
  //   (items: MessageListItemProps[]) => {
  //     dataRef.current = removeDuplicateData(items);
  //     if (needScrollToBottom() === true) {
  //       if (dataRef.current.length > 0) {
  //         if (inverted === true) {
  //           preBottomDataRef.current = dataRef.current[0];
  //         } else {
  //           preBottomDataRef.current =
  //             dataRef.current[dataRef.current.length - 1];
  //         }
  //       }
  //       _refreshToUI(dataRef.current);
  //       unreadCountRef.current = 0;
  //       onChangeUnreadCount?.(unreadCountRef.current);
  //     } else {
  //       const index = dataRef.current.findIndex((d) => {
  //         if (d.id === preBottomDataRef.current?.id) {
  //           return true;
  //         }
  //         return false;
  //       });
  //       if (index !== -1) {
  //         // !!!: Get the element after the specified position in the array and return
  //         if (inverted === true) {
  //           const tmp = dataRef.current.slice(index);
  //           _refreshToUI(tmp);
  //           unreadCountRef.current = dataRef.current.length - tmp.length;
  //           onChangeUnreadCount?.(unreadCountRef.current);
  //         } else {
  //           const tmp = dataRef.current.slice(0, index + 1);
  //           _refreshToUI(tmp);
  //           unreadCountRef.current = dataRef.current.length - tmp.length;
  //           onChangeUnreadCount?.(unreadCountRef.current);
  //         }
  //       } else {
  //         _refreshToUI(dataRef.current);
  //         unreadCountRef.current = 0;
  //         onChangeUnreadCount?.(unreadCountRef.current);
  //       }
  //     }
  //   },
  //   [
  //     dataRef,
  //     removeDuplicateData,
  //     needScrollToBottom,
  //     _refreshToUI,
  //     onChangeUnreadCount,
  //     inverted,
  //   ]
  // );

  // !!! Both gestures and scrolling methods are triggered on the ios platform. However, the android platform only has gesture triggering.
  const onMomentumScrollEnd = React.useCallback(() => {}, []);

  // const { delayExecTask } = useDelayExecTask(
  //   500,
  //   React.useCallback(
  //     (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //       const y = event.nativeEvent.contentOffset.y;
  //       if (inverted === true) {
  //         if (y < 10) {
  //           setNeedScroll(true);
  //           const preId = preBottomDataRef.current?.id;
  //           refreshToUI(dataRef.current);
  //           const item = dataRef.current.find((d) => {
  //             if (d.id === preId) {
  //               return true;
  //             }
  //             return false;
  //           });
  //           if (item?.index !== undefined) {
  //             scrollTo(item.index, false);
  //           }
  //         } else {
  //           setNeedScroll(false);
  //         }
  //       } else {
  //         if (
  //           y + heightRef.current >
  //           event.nativeEvent.contentSize.height - 10
  //         ) {
  //           setNeedScroll(true);
  //           // const preId = preBottomDataRef.current?.id;
  //           // refreshToUI(dataRef.current);
  //           // const item = dataRef.current.find((d) => {
  //           //   if (d.id === preId) {
  //           //     return true;
  //           //   }
  //           //   return false;
  //           // });
  //           // if (item?.index !== undefined) {
  //           //   scrollTo(item.index, false);
  //           // }
  //         } else {
  //           setNeedScroll(false);
  //         }
  //       }
  //       // console.log('test:zuoyu:delayExecTask:', needScrollRef.current);
  //     },
  //     [dataRef, inverted, refreshToUI, scrollTo, setNeedScroll]
  //   )
  // );

  // const requestDataTest = React.useCallback(() => {}, []);

  // const onScroll = React.useCallback(
  //   (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     const y = event.nativeEvent.contentOffset.y;
  //     if (y + heightRef.current > event.nativeEvent.contentSize.height - 10) {
  //       if (inverted === true) {
  //         isTopRef.current = true;
  //       } else {
  //         isBottomRef.current = true;
  //       }
  //     } else {
  //       if (inverted === true) {
  //         isTopRef.current = false;
  //       } else {
  //         isBottomRef.current = false;
  //       }
  //     }
  //     if (y < 10) {
  //       if (inverted === true) {
  //         isBottomRef.current = true;
  //       } else {
  //         isTopRef.current = true;
  //       }
  //     } else {
  //       if (inverted === true) {
  //         isBottomRef.current = false;
  //       } else {
  //         isTopRef.current = false;
  //       }
  //     }
  //     console.log(
  //       'test:zuoyu:onScroll:',
  //       inverted,
  //       isTopRef.current,
  //       isBottomRef.current,
  //       y,
  //       heightRef.current,
  //       event.nativeEvent.contentSize.height,
  //       hasNoMoreRef.current
  //     );
  //     if (userScrollGestureRef.current === true) {
  //       delayExecTask({ ...event });
  //     }
  //   },
  //   [delayExecTask, inverted]
  // );

  const { delayExecTask: delayUserScrollGesture } = useDelayExecTask(
    1000,
    React.useCallback(() => {
      setUserScrollGesture(false);
    }, [setUserScrollGesture])
  );

  const onScrollEndDrag = React.useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      delayUserScrollGesture();
    },
    [delayUserScrollGesture]
  );
  const onScrollBeginDrag = React.useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setUserScrollGesture(true);
    },
    [setUserScrollGesture]
  );

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    // console.log('test:zuoyu:onLayout:', event.nativeEvent.layout.height);
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

  /// When receiving a message, check whether the avatar and nickname of the message in the current message list have been updated.
  /// Delay updates for a specified time.
  const msgUserList = React.useRef<Map<string, DataModel>>(new Map()).current;
  const checkMsgUserToUI = React.useCallback(() => {
    let isExisted = false;
    dataRef.current.map((d) => {
      if (d.model.modelType === 'message') {
        const msgModel = d.model as MessageModel;
        const user = msgUserList.get(msgModel.msg.from);
        if (user) {
          const name = user.remark ?? user.name;
          if (name !== msgModel.userName) {
            msgModel.userName = user.remark ?? user.name;
            isExisted = true;
          }
          if (user.avatar !== msgModel.userAvatar) {
            msgModel.userAvatar = user.avatar;
            isExisted = true;
          }
          d.model = { ...msgModel };
        }
      }
      return d;
    });
    if (isExisted) {
      refreshToUI(dataRef.current);
    }
  }, [dataRef, msgUserList, refreshToUI]);
  const { delayExecTask: delayCheckMsgUserToUI } = useDelayExecTask(
    1000,
    checkMsgUserToUI
  );
  const updateMsgUserInfo = React.useCallback(
    (d: DataModel) => {
      msgUserList.set(d.id, d);
    },
    [msgUserList]
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
        const preIndex = dataRef.current.findIndex((d) => {
          if (d.model.modelType === 'message') {
            const msgModel = d.model as MessageModel;
            const preMsgModel = preBottomDataRef.current?.model as MessageModel;
            if (msgModel.msg.msgId === preMsgModel.msg.msgId) {
              return true;
            }
          }
          return false;
        });
        dataRef.current.splice(index, 1);
        if (index === preIndex) {
          preBottomDataRef.current = dataRef.current[index];
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

  const getMsgModel = React.useCallback(
    async (msg: ChatMessage): Promise<MessageModel | SystemMessageModel> => {
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
        // const user = im.getRequestData(msg.from);
        const d = getMsgInfo(msg);
        updateMsgUserInfo(d);
        const threadMsg =
          msg.chatType === ChatMessageChatType.GroupChat &&
          (comType === 'chat' || comType === 'search')
            ? await msg.threadInfo
            : undefined;
        return {
          userId: msg.from,
          modelType: 'message',
          layoutType:
            messageLayoutType ?? (msg.from === im.userId ? 'right' : 'left'),
          msg: msg,
          quoteMsg: quoteMsg,
          reactions: await msg.reactionList,
          thread: threadMsg,
          userName: d.remark ?? d.name,
          userAvatar: d.avatar,
          checked: selectType === 'multi' ? false : undefined,
        } as MessageModel;
      }
    },
    [comType, getMsgInfo, im, messageLayoutType, selectType, updateMsgUserInfo]
  );

  const onAddMessageListToUI = React.useCallback(
    async (msgs: ChatMessage[], position: MessageAddPosition) => {
      const tmp = inverted === true ? msgs.slice().reverse() : msgs;
      const list = tmp.map(async (msg) => {
        return {
          id: msg.msgId.toString(),
          model: await getMsgModel(msg),
          containerStyle: getStyle(),
        } as MessageListItemProps;
      });
      const l = await Promise.all(list);
      // dataRef.current.forEach((d) => {
      //   const msgModel = d.model as MessageModel;
      //   console.log(
      //     'test:zuoyu:dataref:1',
      //     msgModel.msg.msgId,
      //     msgModel.msg.serverTime
      //   );
      // });
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
      // dataRef.current.forEach((d) => {
      //   const msgModel = d.model as MessageModel;
      //   console.log(
      //     'test:zuoyu:dataref:2',
      //     msgModel.msg.msgId,
      //     msgModel.msg.serverTime
      //   );
      // });

      refreshToUI(dataRef.current);
      delayCheckMsgUserToUI();
      return l as MessageListItemProps[];
    },
    [
      dataRef,
      delayCheckMsgUserToUI,
      getMsgModel,
      getStyle,
      inverted,
      refreshToUI,
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

  const onRemoveMessageThreadToUI = React.useCallback(
    (msgId: string) => {
      if (comType !== 'chat' && comType !== 'search') {
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
      const isTranslated = model.msg.attributes?.[gMessageAttributeTranslate];
      if (isTranslated === true) {
        const newMsg = { ...model.msg } as ChatMessage;
        newMsg.attributes = {
          ...model.msg.attributes,
          [gMessageAttributeTranslate]: false,
        };
        // const body = { ...newMsg.body } as ChatTextMessageBody;
        // body.translations = undefined;
        // body.targetLanguageCodes = undefined;
        // newMsg.body = body;
        im.updateMessage({ message: newMsg, onResult: () => {} });
        onUpdateMessageToUI(newMsg, 'recv');
      } else {
        im.translateMessage({
          message: model.msg,
          languages: [languageCode],
          onResult: async (result) => {
            if (result.isOk === true && result.value) {
              const newMsg = { ...result.value } as ChatMessage;
              newMsg.attributes = {
                ...model.msg.attributes,
                [gMessageAttributeTranslate]: true,
              };
              im.updateMessage({ message: newMsg, onResult: () => {} });
              onUpdateMessageToUI(newMsg, 'recv');
            }
          },
        });
      }
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
          im.leaveThread({ threadId: thread.threadId });
        }
      }
    },
    [im, onClickedLeaveThread, thread]
  );

  const _onClickedDestroyThread = React.useCallback(
    (threadId: string) => {
      if (onClickedDestroyThread) {
        onClickedDestroyThread(threadId);
      } else {
        if (thread) {
          if (thread?.owner === im.userId) {
            im.destroyThread({ threadId: thread.threadId });
          }
        }
      }
    },
    [im, onClickedDestroyThread, thread]
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
    });

  const _onClickedEditThreadName = React.useCallback(
    (thread: ChatMessageThread) => {
      im.getGroupInfo({
        groupId: thread.parentId,
        onResult: (res) => {
          if (res.isOk && res.value) {
            const isOwner = res.value.owner === im.userId;
            onShowMessageThreadListMoreActions({
              thread,
              onClickedEditThreadName: _onClickedEditThreadName,
              onClickedLeaveThread: _onClickedLeaveThread,
              onClickedDestroyThread: _onClickedDestroyThread,
              onClickedOpenThreadMemberList,
              isOwner: isOwner,
            });
          }
        },
      });
      if (thread?.owner === im.userId) {
        onClickedEditThreadName?.(thread);
      }
    },
    [
      _onClickedDestroyThread,
      _onClickedLeaveThread,
      im,
      onClickedEditThreadName,
      onClickedOpenThreadMemberList,
      onShowMessageThreadListMoreActions,
    ]
  );

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
            const r = msgModel.reactions[index]!;
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
              });
            } else if (isExisted && isExisted.isAddedBySelf === false) {
              im.addReactionToMessage({
                msgId: model.msg.msgId,
                reaction: face,
              });
            } else if (!isExisted) {
              im.addReactionToMessage({
                msgId: model.msg.msgId,
                reaction: face,
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
                const e = emoji.convert.fromCodePoint(d.name.substring(2));
                if (r.reaction === e) {
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
          const list = emojiListRef.current.slice(0, 7);
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
              onShowMessageLongPressActions({
                id,
                model,
                emojiList: updateList,
                onFace,
                convId,
                convType,
                comType,
              });
            } else {
              onShowMessageLongPressActions({
                id,
                model,
                convId,
                convType,
                comType,
              });
            }
          });
        }
      }
    },
    [
      comType,
      convId,
      convType,
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
              reactionList: [
                ...msgModel.reactions.map((v) => {
                  return {
                    ...v,
                    userList: v.userList.map((v) => {
                      return {
                        id: v,
                        name: getContactInfo(v).name,
                        avatar: getContactInfo(v).avatar,
                      } as DataModel;
                    }),
                  } as MessageReactionModel;
                }),
              ],
              msgId: msgModel.msg.msgId,
              onRequestModalClose: onRequestCloseReaction,
            });
          }
        } else {
          onEmojiClicked(face, model as MessageModel);
        }
      }
    },
    [getContactInfo, onEmojiClicked, onRequestCloseReaction]
  );

  const onClickedListItemThread = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType === 'message') {
        const msgModel = model as MessageModel;
        if (msgModel.thread) {
          if (
            msgModel.thread.msgId.length === 0 ||
            msgModel.thread.owner.length === 0
          ) {
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

  const cancelHighLight = React.useCallback(() => {
    const isExisted = dataRef.current.find((d) => {
      if (d.model.modelType === 'message') {
        const msgModel = d.model as MessageModel;
        if (msgModel.isHightBackground !== undefined) {
          msgModel.isHightBackground = false;
          d.model = { ...msgModel };
          return true;
        }
      }
      return false;
    });
    if (isExisted) {
      refreshToUI(dataRef.current);
    }
  }, [dataRef, refreshToUI]);

  const onAddMessageToUI = React.useCallback(
    async (msg: ChatMessage, isHigh?: boolean) => {
      const d = getMsgInfo(msg);
      updateMsgUserInfo(d);
      if (comType === 'thread' || comType === 'create_thread') {
        if (msg.isChatThread !== true) {
          onAddDataToUI(
            {
              id: msg.msgId.toString(),
              model: {
                userId: msg.from,
                userAvatar: d.avatar,
                userName: d.remark ?? d.name,
                modelType: 'history',
                msg: msg,
                checked: selectType === 'multi' ? false : undefined,
              },
              containerStyle: getStyle(),
            },
            inverted === true ? 'bottom' : 'bottom'
          );
        } else {
          onAddDataToUI(
            {
              id: msg.msgId.toString(),
              model: await getMsgModel(msg),
              containerStyle: getStyle(),
            },
            inverted === true ? 'bottom' : 'bottom'
          );
        }
      } else {
        onAddDataToUI(
          {
            id: msg.msgId.toString(),
            model: await getMsgModel(msg),
            containerStyle: getStyle(),
          },
          inverted === true ? 'bottom' : 'bottom'
        );
      }

      if (isHigh !== undefined) {
        setTimeout(() => {
          cancelHighLight();
        }, 1000);
      }

      delayCheckMsgUserToUI();
    },
    [
      comType,
      getMsgInfo,
      updateMsgUserInfo,
      delayCheckMsgUserToUI,
      onAddDataToUI,
      selectType,
      getStyle,
      inverted,
      getMsgModel,
      cancelHighLight,
    ]
  );

  const onUpdateMessageThreadToUI = React.useCallback(
    (msgId: string, thread: ChatMessageThread) => {
      if (enableThread !== true) {
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
        if (comType === 'chat' || comType === 'search') {
          refreshToUI(dataRef.current);
        }
      } else {
        if (comType === 'create_thread' || comType === 'thread') {
          const msg = thread.lastMessage;
          if (msg) {
            onAddMessageToUI(msg);
          }
        }
      }
    },
    [comType, dataRef, enableThread, onAddMessageToUI, refreshToUI]
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
        inverted === true ? 'bottom' : 'bottom'
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

  const sendMessageToServer = React.useCallback(
    (msg: ChatMessage) => {
      im.messageManager.sendMessage(msg);
    },
    [im]
  );

  const createThread = React.useCallback(
    (onResult: ResultCallback<ChatMessageThread>) => {
      if (propsMsgId && parentId) {
        im.createThread({
          name: newThreadName ?? 'default_name',
          msgId: propsMsgId,
          parentId: parentId,
          onResult: onResult,
        });
      }
    },
    [propsMsgId, parentId, im, newThreadName]
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

  const getDataMessage = React.useCallback(
    (position: 'first' | 'last') => {
      let data = dataRef.current;
      if (position === 'first') {
        if (inverted === true) {
          data = dataRef.current.slice().reverse();
        }
      } else if (position === 'last') {
        if (inverted === false) {
          data = dataRef.current.slice().reverse();
        }
      }
      const index = data.findIndex((d) => {
        return d.model.modelType === 'message';
      });
      if (index !== -1) {
        return data[index]!.model as MessageModel;
      }
      return undefined;
    },
    [dataRef, inverted]
  );

  const addHightMessage = React.useCallback(
    async (msgId: string) => {
      const msg = await im.getMessage({ messageId: msgId });
      if (msg) {
        onAddMessageToUI(msg, true);
      }
    },
    [im, onAddMessageToUI]
  );

  const isGettingRef = React.useRef(false);
  const setIsGetting = React.useCallback((value: boolean) => {
    // console.log('test:zuoyu:setIsGetting:', value);
    isGettingRef.current = value;
  }, []);
  const requestBeforeMessages = React.useCallback(
    async (startId: string, includeStartId?: boolean) => {
      // console.log(
      //   'test:zuoyu:requestBeforeMessages',
      //   hasNoOldMsgRef.current,
      //   isGettingRef.current
      // );
      if (hasNoOldMsgRef.current === true) {
        onNoMoreMessage?.();
        return;
      }
      if (isGettingRef.current === false) {
        setIsGetting(true);
      } else {
        return;
      }

      try {
        do {
          const msgs = await im.messageManager.loadHistoryMessage({
            convId,
            convType,
            startMsgId: startId,
            loadCount: gRequestMaxMessageCount,
            direction: ChatSearchDirection.UP,
          });
          if (msgs.length < gRequestMaxMessageCount) {
            setNoOldMsg(true);
          }
          if (msgs.length > 0) {
            const newStartMsgId = msgs[0]!.msgId;
            if (newStartMsgId === beforeMsgIdRef.current) {
              // console.log('test:zuoyu:ba:3', newStartMsgId);
              break;
            }
            beforeMsgIdRef.current = msgs[0]!.msgId;
            afterMsgIdRef.current =
              dataRef.current.length === 0
                ? msgs[msgs.length - 1]!.msgId
                : getDataMessage('last')?.msg.msgId ?? '';
            // console.log(
            //   'test:zuoyu:ba:',
            //   dataRef.current.length,
            //   beforeMsgIdRef.current,
            //   afterMsgIdRef.current
            // );
            // msgs.forEach((item) => {
            //   console.log('test:zuoyu:msgs:', item.msgId, item.serverTime, item);
            // });

            if (includeStartId && startId.length > 0) {
              const startMsg = await im.getMessage({ messageId: startId });
              if (startMsg) {
                msgs.push(startMsg!);
                afterMsgIdRef.current =
                  dataRef.current.length === 0
                    ? startId
                    : getDataMessage('last')?.msg.msgId ?? '';
              }
            }

            const list = await onAddMessageListToUI(msgs, 'top');
            list.map((v) => {
              if (v.model.modelType === 'message') {
                const msgModel = v.model as MessageModel;
                sendRecvMessageReadAck(msgModel.msg);
              }
            });
          }
          setIsGetting(false);
        } while (false);
      } catch (error) {
        console.warn('dev:requestBeforeMessages:', error);
        setIsGetting(false);
      }
    },
    [
      convId,
      convType,
      dataRef,
      getDataMessage,
      im,
      onAddMessageListToUI,
      onNoMoreMessage,
      sendRecvMessageReadAck,
      setIsGetting,
      setNoOldMsg,
    ]
  );
  const requestAfterMessages = React.useCallback(
    async (startId: string, maxCount?: number) => {
      // console.log(
      //   'test:zuoyu:requestAfterMessages',
      //   startId,
      //   maxCount,
      //   hasNoNewMsgRef.current,
      //   isGettingRef.current
      // );
      if (hasNoNewMsgRef.current === true) {
        setUnreadCount(0);
        return;
      }
      if (isGettingRef.current === false) {
        setIsGetting(true);
      } else {
        return;
      }

      try {
        do {
          const _maxCount = maxCount ?? gRequestMaxMessageCount;
          const msgs = await im.messageManager.loadHistoryMessage({
            convId,
            convType,
            startMsgId: startId,
            loadCount: _maxCount,
            direction: ChatSearchDirection.DOWN,
          });
          if (msgs.length < _maxCount) {
            setNoNewMsg(true);
          }
          if (msgs.length > 0) {
            const newStartMsgId = msgs[msgs.length - 1]!.msgId;
            if (newStartMsgId === afterMsgIdRef.current) {
              // console.log('test:zuoyu:ba:1', newStartMsgId);
              break;
            }
            beforeMsgIdRef.current =
              dataRef.current.length === 0
                ? msgs[0]!.msgId
                : getDataMessage('first')?.msg.msgId ?? '';
            afterMsgIdRef.current = msgs[msgs.length - 1]!.msgId;
            // console.log(
            //   'test:zuoyu:ba:2',
            //   dataRef.current.length,
            //   beforeMsgIdRef.current,
            //   afterMsgIdRef.current
            // );
            // msgs.forEach((item) => {
            //   console.log('test:zuoyu:msgs:', item.msgId, item.serverTime);
            // });
            const list = await onAddMessageListToUI(msgs, 'bottom');
            list.map((v) => {
              if (v.model.modelType === 'message') {
                const msgModel = v.model as MessageModel;
                sendRecvMessageReadAck(msgModel.msg);
              }
            });
          }
        } while (false);
        setIsGetting(false);
      } catch (error) {
        console.warn('dev:requestAfterMessages:', error);
        setIsGetting(false);
      }
    },
    [
      setUnreadCount,
      setIsGetting,
      im.messageManager,
      convId,
      convType,
      setNoNewMsg,
      dataRef,
      getDataMessage,
      onAddMessageListToUI,
      sendRecvMessageReadAck,
    ]
  );

  const loadAllLatestMessage = React.useCallback(async () => {
    while (true) {
      // console.log('test:zuoyu:loadAllLatestMessage:', hasNoNewMsgRef.current);
      await requestAfterMessages(afterMsgIdRef.current, 400);
      if (hasNoNewMsgRef.current === true) {
        break;
      }
    }
  }, [requestAfterMessages]);

  const _addSendMessageToUI = React.useCallback(
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
      isShow: boolean
    ): MessageListItemProps | undefined => {
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
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            quoteMsg: quoteMsg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
      } else if (value.type === 'custom') {
        const custom = value as SendCustomProps;
        const msg = custom.msg;
        ret = {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            userAvatar: im.user(im.userId)?.avatarURL,
            userName: im.user(im.userId)?.userName,
            modelType: 'message',
            layoutType: messageLayoutType ?? 'right',
            msg: msg,
            checked: selectType === 'multi' ? false : undefined,
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
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
        if (isShow === true) {
          onAddDataToUI(ret, 'bottom');
        }
      }
      return ret;
    },
    [
      comType,
      convId,
      convType,
      getStyle,
      im,
      messageLayoutType,
      onAddDataToUI,
      selectType,
    ]
  );

  const addSendMessageToUI = React.useCallback(
    async (params: {
      value:
        | SendFileProps
        | SendImageProps
        | SendTextProps
        | SendVideoProps
        | SendVoiceProps
        | SendTimeProps
        | SendSystemProps
        | SendCardProps
        | SendCustomProps;

      onFinished?: (item: MessageListItemProps) => void;
      onBeforeCallback?: () => void | Promise<void>;
    }) => {
      const { value, onFinished, onBeforeCallback } = params;
      let isShow = canAddNewMessageToUI();
      if (comType === 'chat' || comType === 'search') {
        if (isShow === false) {
          isShow = true;
          await loadAllLatestMessage();
          await onBeforeCallback?.();
        }
      } else if (comType === 'thread') {
        if (isShow === false) {
          setNoNewMsg(false);
        }
      }
      let ret: MessageListItemProps | undefined = _addSendMessageToUI(
        value,
        isShow
      );
      if (ret) {
        onFinished?.(ret);
        if (isShow === true) {
          scrollToBottom();
        }
      }
    },
    [
      _addSendMessageToUI,
      canAddNewMessageToUI,
      comType,
      loadAllLatestMessage,
      scrollToBottom,
      setNoNewMsg,
    ]
  );

  const requestThreadAfterMessages = React.useCallback(
    async (startId: string, maxCount?: number) => {
      // console.log(
      //   'test:zuoyu:requestThreadAfterMessages',
      //   startId,
      //   maxCount,
      //   hasNoNewMsgRef.current,
      //   isGettingRef.current,
      //   comType
      // );
      if (hasNoNewMsgRef.current === true) {
        setUnreadCount(0);
        return;
      }
      if (isGettingRef.current === false) {
        setIsGetting(true);
      } else {
        return;
      }

      let msgCount = 0;

      try {
        do {
          const _maxCount = maxCount ?? gRequestMaxThreadCount;
          const result = await im.fetchHistoryMessages({
            convId,
            convType,
            startMsgId: startId,
            direction: ChatSearchDirection.DOWN,
            pageSize: _maxCount,
          });
          const msgs = result.list;
          if (msgs === undefined) {
            setNoNewMsg(true);
            break;
          }
          msgCount = msgs.length;
          if (msgs.length < _maxCount) {
            setNoNewMsg(true);
          }
          if (msgs.length === 0 && startId === '') {
            if (firstMessage) {
              if (inverted === false) {
                setIsBottom(true);
              }
              addSendMessageToUI({
                value: {
                  type: 'system',
                  msg: createMessageTip({
                    convId: convId,
                    convType: convType,
                    event: gCustomMessageCreateThreadTip,
                  }),
                },
                onFinished: (item) => {
                  im.insertMessage({
                    message: (item.model as MessageModel).msg,
                  });
                },
              });
              addSendMessageToUI({
                value: firstMessage,
                onFinished: (item) => {
                  if (item.model.modelType === 'message') {
                    const msgModel = item.model as MessageModel;
                    sendMessageToServer(msgModel.msg);
                  }
                },
              });
            }
          }
          if (msgs.length > 0) {
            const newStartMsgId = msgs[msgs.length - 1]!.msgId;
            if (newStartMsgId === afterMsgIdRef.current) {
              break;
            }
            beforeMsgIdRef.current =
              dataRef.current.length === 0
                ? msgs[0]!.msgId
                : getDataMessage('first')?.msg.msgId ?? '';
            afterMsgIdRef.current = msgs[msgs.length - 1]!.msgId;
            // console.log(
            //   'test:zuoyu:ba:2',
            //   dataRef.current.length,
            //   beforeMsgIdRef.current,
            //   afterMsgIdRef.current
            // );
            // msgs.forEach((item) => {
            //   console.log('test:zuoyu:msgs:', item.msgId, item.serverTime, item.body);
            // });
            onAddMessageListToUI(msgs, 'bottom');
          }
        } while (false);
        setIsGetting(false);
        return msgCount;
      } catch (error) {
        console.warn('dev:requestAfterMessages:', error);
        setIsGetting(false);
        return msgCount;
      }
    },
    [
      setUnreadCount,
      setIsGetting,
      im,
      convId,
      convType,
      setNoNewMsg,
      firstMessage,
      inverted,
      addSendMessageToUI,
      createMessageTip,
      setIsBottom,
      sendMessageToServer,
      dataRef,
      getDataMessage,
      onAddMessageListToUI,
    ]
  );

  // const _onRefresh = React.useCallback(() => {
  //   // setRefreshing?.(true);
  //   // requestHistoryMessage();
  //   // setTimeout(() => {
  //   //   setRefreshing?.(false);
  //   // }, 100);
  // }, []);

  // const _onMore = React.useCallback(() => {
  //   // if (unreadCountRef.current > 0) {
  //   //   setNeedScroll(true);
  //   //   refreshToUI(dataRef.current);
  //   // } else {
  //   //   requestHistoryMessage();
  //   // }
  // }, []);

  // const scrollToMessage = React.useCallback(
  //   (msgId: string) => {
  //     console.log('test:zuoyu:scrollToMessage:', msgId);
  //     timeoutTask(1000, () => {
  //       if (msgId.length > 0) {
  //         const isExisted = dataRef.current.find((d) => {
  //           if (d.model.modelType === 'message') {
  //             const msgModel = d.model as MessageModel;
  //             if (msgModel.msg.msgId === msgId) {
  //               return true;
  //             }
  //           }
  //           return false;
  //         });
  //         if (isExisted && isExisted.index && isExisted.index > -1) {
  //           console.log('test:zuoyu:scrollToMessage:', isExisted.index, msgId);
  //           scrollTo(isExisted.index, false);
  //         }
  //       }
  //     });
  //   },
  //   [dataRef, scrollTo]
  // );

  const onRequestBeforeMessages = React.useCallback(() => {
    requestBeforeMessages(beforeMsgIdRef.current);
  }, [requestBeforeMessages]);

  const onRequestAfterMessages = React.useCallback(() => {
    requestAfterMessages(afterMsgIdRef.current);
  }, [requestAfterMessages]);

  const onRequestThreadAfterMessages = React.useCallback(() => {
    requestThreadAfterMessages(afterMsgIdRef.current);
  }, [requestThreadAfterMessages]);

  const currentYRef = React.useRef(0);
  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const heightOffset = heightRef.current * reachedThreshold;
      const y = event.nativeEvent.contentOffset.y;
      if (currentYRef.current === 0) {
        currentYRef.current = y;
      }
      const deltY = y - currentYRef.current;
      currentYRef.current = y;
      if (
        y + heightRef.current >
        event.nativeEvent.contentSize.height - heightOffset
      ) {
        if (inverted === true) {
          setIsTop(true);
        } else {
          setIsBottom(true);
        }
      } else {
        if (inverted === true) {
          setIsTop(false);
        } else {
          setIsBottom(false);
        }
      }
      if (y < heightOffset) {
        if (inverted === true) {
          setIsBottom(true);
        } else {
          setIsTop(true);
        }
      } else {
        if (inverted === true) {
          setIsBottom(false);
        } else {
          setIsTop(false);
        }
      }
      // console.log(
      //   'test:zuoyu:onScroll:',
      //   comType,
      //   heightOffset,
      //   inverted,
      //   isTopRef.current,
      //   isBottomRef.current,
      //   deltY,
      //   y,
      //   heightRef.current,
      //   event.nativeEvent.contentSize.height,
      //   hasNoMoreRef.current,
      //   userScrollGestureRef.current
      // );
      if (userScrollGestureRef.current === true) {
        if (isTopRef.current === true && deltY > 0) {
          if (comType === 'chat' || comType === 'search') {
            onRequestBeforeMessages();
          }
        } else if (isBottomRef.current === true && deltY < 0) {
          if (comType === 'chat' || comType === 'search') {
            onRequestAfterMessages();
          } else if (comType === 'thread') {
            onRequestThreadAfterMessages();
          }
        }
      }
    },
    [
      comType,
      inverted,
      onRequestAfterMessages,
      onRequestBeforeMessages,
      onRequestThreadAfterMessages,
      reachedThreshold,
      setIsBottom,
      setIsTop,
    ]
  );

  const { delayExecTask: delayRequestMessages } = useDelayExecTask(
    100,
    React.useCallback(
      (deltY: number) => {
        if (isTopRef.current === true && deltY > 0) {
          if (comType === 'chat' || comType === 'search') {
            onRequestBeforeMessages();
          }
        } else if (isBottomRef.current === true && deltY < 0) {
          if (comType === 'chat' || comType === 'search') {
            onRequestAfterMessages();
          } else if (comType === 'thread') {
            onRequestThreadAfterMessages();
          }
        }
      },
      [
        comType,
        onRequestAfterMessages,
        onRequestBeforeMessages,
        onRequestThreadAfterMessages,
      ]
    )
  );

  const currentY2Ref = React.useRef(0);
  const onTouchMove = React.useCallback(
    (event: GestureResponderEvent) => {
      // Edge requests, a complement to `onScroll`.
      if (isTopRef.current === true || isBottomRef.current === true) {
        const y = event.nativeEvent.pageY;
        if (currentY2Ref.current === 0) {
          currentY2Ref.current = y;
        }
        const deltY = y - currentY2Ref.current;
        currentY2Ref.current = y;
        // console.log('test:zuoyu:onTouchMove:', deltY, y);
        delayRequestMessages(deltY);
      }
    },
    [delayRequestMessages]
  );

  const init = React.useCallback(async () => {
    console.log('dev:MessageList:', convId, convType);
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      setUserScrollGesture(false);
      currentVoicePlayingRef.current = undefined;
      startMsgIdRef.current = '';
      beforeMsgIdRef.current = '';
      afterMsgIdRef.current = '';
      hasNoMoreRef.current = false;
      setNoNewMsg(false);
      setNoOldMsg(false);
      dataRef.current = [];
      if (comType === 'chat') {
        setIsBottom(true);
        setNoNewMsg(true);
      } else if (comType === 'thread') {
        setNoOldMsg(true);
        if (inverted === true) {
          setIsBottom(true);
        } else {
          setIsTop(true);
        }
      } else if (comType === 'search') {
        if (inverted === true) {
          setIsBottom(true);
        } else {
          setIsTop(true);
        }
      }
      im.messageManager.setRecallMessageTimeout(recallTimeout);
      refreshToUI(dataRef.current);
    }
  }, [
    comType,
    convId,
    convType,
    dataRef,
    im.messageManager,
    inverted,
    isAutoLoad,
    recallTimeout,
    refreshToUI,
    setIsBottom,
    setIsTop,
    setNoNewMsg,
    setNoOldMsg,
    setUserScrollGesture,
    testMode,
  ]);

  const onContentSizeChange = React.useCallback((_w: number, _h: number) => {
    // console.log('test:zuoyu:onContentSizeChange:', _w, _h);
  }, []);

  const requestThreadHeaderMessage = React.useCallback(async () => {
    let messageId;
    if (comType === 'create_thread') {
      messageId = propsMsgId;
    } else if (comType === 'thread') {
      messageId = thread?.msgId;
    }
    if (!messageId) {
      return;
    }

    if (propsMsgId || thread) {
      const msg = await im.getMessage({ messageId: messageId });
      if (msg) {
        onAddMessageToUI(msg);
      }
    }
  }, [comType, im, onAddMessageToUI, thread, propsMsgId]);

  // const requestThreadHistoryMessage = React.useCallback(async () => {
  //   if (hasNoMoreRef.current === true) {
  //     onNoMoreMessage?.();
  //     return;
  //   }
  //   if (startMsgIdRef.current === '') {
  //     if (thread && thread.owner !== im.userId) {
  //       im.joinThread({
  //         threadId: convId,
  //         onResult: (res) => {
  //           console.log('dev:joinThread:', res);
  //         },
  //       });
  //     }

  //     await requestThreadHeaderMessage();
  //   }

  //   // im.messageManager.loadHistoryMessage({
  //   //   convId,
  //   //   convType,
  //   //   startMsgId: startMsgIdRef.current,
  //   //   loadCount: gRequestMaxMessageCount,
  //   //   direction: ChatSearchDirection.DOWN,
  //   //   isChatThread: true,
  //   //   onResult: (msgs) => {
  //   //     if (msgs.length < gRequestMaxMessageCount) {
  //   //       hasNoMoreRef.current = true;
  //   //     }
  //   //     if (msgs.length > 0) {
  //   //       const newStartMsgId = msgs[msgs.length - 1]!.msgId.toString();
  //   //       if (newStartMsgId === startMsgIdRef.current) {
  //   //         return;
  //   //       }
  //   //       startMsgIdRef.current = msgs[msgs.length - 1]!.msgId.toString();
  //   //       if (comType === 'thread') {
  //   //         setNeedScroll(true);
  //   //       }
  //   //       onAddMessageListToUI(msgs, 'bottom', () => {});
  //   //     }
  //   //   },
  //   // });

  //   // !!! bug for local message ID.
  //   im.fetchHistoryMessages({
  //     convId,
  //     convType,
  //     startMsgId: startMsgIdRef.current,
  //     direction: ChatSearchDirection.DOWN,
  //     pageSize: gRequestMaxMessageCount,
  //     onResult: (res) => {
  //       if (res.isOk && res.value && res.value.list) {
  //         if (res.value.list.length === 0 && startMsgIdRef.current === '') {
  //           hasNoMoreRef.current = true;
  //           if (firstMessage) {
  //             addSendMessageToUI(firstMessage, (item) => {
  //               if (item.model.modelType === 'message') {
  //                 const msgModel = item.model as MessageModel;
  //                 sendMessageToServer(msgModel.msg);
  //               }
  //             });
  //           }
  //         } else {
  //           const msgs = res.value.list;
  //           startMsgIdRef.current = res.value.cursor;
  //           if (msgs.length < gRequestMaxMessageCount) {
  //             hasNoMoreRef.current = true;
  //           }
  //           if (msgs.length > 0) {
  //             onAddMessageListToUI(msgs, 'bottom');
  //           }
  //         }
  //       }
  //     },
  //   });
  // }, [
  //   addSendMessageToUI,
  //   convId,
  //   convType,
  //   firstMessage,
  //   im,
  //   onAddMessageListToUI,
  //   onNoMoreMessage,
  //   requestThreadHeaderMessage,
  //   sendMessageToServer,
  //   thread,
  // ]);

  // const requestHistoryMessage = React.useCallback(() => {
  //   // if (comType === 'create_thread') {
  //   //   requestThreadHeaderMessage();
  //   //   return;
  //   // }
  //   // if (comType === 'thread') {
  //   //   requestThreadHistoryMessage();
  //   //   return;
  //   // }
  //   // if (hasNoMoreRef.current === true) {
  //   //   onNoMoreMessage?.();
  //   //   return;
  //   // }
  //   // im.messageManager.loadHistoryMessage({
  //   //   convId,
  //   //   convType,
  //   //   startMsgId: startMsgIdRef.current,
  //   //   loadCount: gRequestMaxMessageCount,
  //   //   onResult: (msgs) => {
  //   //     if (msgs.length < gRequestMaxMessageCount) {
  //   //       hasNoMoreRef.current = true;
  //   //     }
  //   //     if (msgs.length > 0) {
  //   //       const newStartMsgId = msgs[0]!.msgId.toString();
  //   //       if (newStartMsgId === startMsgIdRef.current) {
  //   //         return;
  //   //       }
  //   //       startMsgIdRef.current = msgs[0]!.msgId.toString();
  //   //       onAddMessageListToUI(
  //   //         msgs,
  //   //         inverted === true ? 'top' : 'bottom',
  //   //         (list) => {
  //   //           list.map((v) => {
  //   //             if (v.model.modelType === 'message') {
  //   //               const msgModel = v.model as MessageModel;
  //   //               sendRecvMessageReadAck(msgModel.msg);
  //   //             }
  //   //           });
  //   //         }
  //   //       );
  //   //     }
  //   //   },
  //   // });
  // }, []);

  const onInit = React.useCallback(async () => {
    init();
    if (comType === 'chat') {
      await requestBeforeMessages(beforeMsgIdRef.current);
    } else if (comType === 'create_thread') {
      await requestThreadHeaderMessage();
    } else if (comType === 'thread') {
      await requestThreadHeaderMessage();
      const ret = await requestThreadAfterMessages(afterMsgIdRef.current);
      if (ret && ret < gRequestMaxThreadCount) {
        if (inverted === true) {
          setIsTop(true);
        } else {
          setIsBottom(true);
        }
      }
    } else if (comType === 'search') {
      if (propsMsgId) {
        await requestBeforeMessages(propsMsgId, true);
        await addHightMessage(propsMsgId);
        // await requestAfterMessages(propsMsgId, 1);
      }
    }
  }, [
    addHightMessage,
    comType,
    init,
    inverted,
    propsMsgId,
    requestBeforeMessages,
    requestThreadAfterMessages,
    requestThreadHeaderMessage,
    setIsBottom,
    setIsTop,
  ]);

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
          addSendMessageToUI({
            value,
            onFinished: (item) => {
              if (item.model.modelType === 'message') {
                const msgModel = item.model as MessageModel;
                sendMessageToServer(msgModel.msg);
              }
            },
            // onBeforeCallback: async () => {
            //   if (comType === 'chat' || comType === 'search') {
            //     return loadAllLatestMessage();
            //   }
            // },
          });
        },
        addSendMessageToUI: (params: {
          value:
            | SendFileProps
            | SendImageProps
            | SendTextProps
            | SendVideoProps
            | SendVoiceProps
            | SendTimeProps
            | SendSystemProps
            | SendCardProps
            | SendCustomProps;

          onFinished?: (item: MessageListItemProps) => void;
          onBeforeCallback?: () => void | Promise<void>;
        }): Promise<void> => {
          return addSendMessageToUI(params);
        },
        sendMessageToServer: (msg: ChatMessage) => {
          return sendMessageToServer(msg);
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
        loadHistoryMessage: async (
          msgs: ChatMessage[],
          pos: MessageAddPosition
        ) => {
          if (pos === 'top') {
            if (msgs.length > 0) {
              if (startMsgIdRef.current === msgs[0]?.msgId) {
                return;
              }
              startMsgIdRef.current = msgs[0]!.msgId.toString();
            }
          }
          const list = await onAddMessageListToUI(msgs, pos);
          list.map((v) => {
            if (v.model.modelType === 'message') {
              const msgModel = v.model as MessageModel;
              sendRecvMessageReadAck(msgModel.msg);
            }
          });
        },
        onInputHeightChange: (height: number) => {
          if (inverted === false) {
            if (height > 0) {
              if (comType === 'thread' && inverted === false) {
                // scrollToBottom();
              }
            }
          }
        },
        editMessageFinished: (model) => {
          editMessage(model.msg);
        },
        scrollToBottom: async () => {
          await loadAllLatestMessage();
          scrollToBottom();
        },
        startShowThreadMoreMenu: () => {
          if (thread && thread.parentId) {
            im.getGroupInfo({
              groupId: thread.parentId,
              onResult: (res) => {
                if (res.isOk && res.value) {
                  const isOwner = res.value.owner === im.userId;
                  onShowMessageThreadListMoreActions({
                    thread,
                    onClickedEditThreadName: _onClickedEditThreadName,
                    onClickedLeaveThread: _onClickedLeaveThread,
                    onClickedDestroyThread: _onClickedDestroyThread,
                    onClickedOpenThreadMemberList,
                    isOwner: isOwner,
                  });
                }
              },
            });
          } else {
            console.log('dev:startShowThreadMoreMenu');
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
      _onClickedDestroyThread,
      _onClickedEditThreadName,
      _onClickedLeaveThread,
      addSendMessageToUI,
      cancelMultiSelected,
      comType,
      createThread,
      deleteMessage,
      deleteMessages,
      editMessage,
      im,
      inverted,
      loadAllLatestMessage,
      onAddMessageListToUI,
      onClickedOpenThreadMemberList,
      onCreateThreadResult,
      onShowMessageThreadListMoreActions,
      onUpdateMessageToUI,
      recallMessage,
      scrollToBottom,
      sendMessageToServer,
      sendRecvMessageReadAck,
      thread,
      tr,
    ]
  );

  React.useEffect(() => {
    const listener = () => {};
    addListener(convId, listener);
    return () => {
      removeListener(convId, listener);
    };
  }, [addListener, convId, removeListener]);

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
          onInit();
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [convId, dataRef, im, onInit, refreshToUI]);

  React.useEffect(() => {
    const listener = {
      onSendMessageChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'send');
        if (canAddNewMessageToUI()) {
          if (comType === 'thread' && inverted === false) {
            scrollToBottom();
          }
        }
      },
      onRecvMessage: async (msg: ChatMessage) => {
        if (msg.conversationId === convId) {
          if (canAddNewMessageToUI() || recvMessageAutoScroll === true) {
            setUnreadCount(0);
            await onAddMessageToUI(msg);
            sendRecvMessageReadAck(msg);
            if (comType === 'chat') {
              scrollToBottom();
            } else if (comType === 'thread') {
              scrollToBottom();
            }
          } else {
            setNoNewMsg(false);
            setUnreadCount(++unreadCountRef.current);
          }
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
    canAddNewMessageToUI,
    comType,
    convId,
    im,
    inverted,
    onAddMessageToUI,
    onRecvRecallMessage,
    onUpdateMessageToUI,
    recvMessageAutoScroll,
    scrollToBottom,
    sendRecvMessageReadAck,
    setNoNewMsg,
    setUnreadCount,
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
        if (msgId && (comType === 'chat' || comType === 'search')) {
          if (convId === event.thread.parentId) {
            // !!! owner is empty. It is a bug.
            if (event.thread.owner.length === 0 && event.from.length > 0) {
              event.thread.owner = event.from;
            }
            onUpdateMessageThreadToUI(msgId, event.thread);
          }
        }
      },
      onChatMessageThreadUpdated: async (event: ChatMessageThreadEvent) => {
        const msgId = event.thread.msgId;
        // console.log(
        //   'test:zuoyu:onChatMessageThreadUpdated',
        //   msgId,
        //   convId,
        //   event.thread
        // );
        if (msgId) {
          if (
            (comType === 'chat' || comType === 'search') &&
            convId === event.thread.parentId
          ) {
            const thread = { ...event.thread };
            if (thread && thread?.lastMessage === undefined) {
              const threadMsg = await im.getMessage({ messageId: msgId });
              if (threadMsg) {
                const t = await threadMsg.threadInfo;
                const msg = t?.lastMessage;
                if (msg) {
                  thread.lastMessage = msg;
                }
              }
            }
            onUpdateMessageThreadToUI(msgId, thread);
          } else if (comType === 'thread' && convId === event.thread.threadId) {
            if (canAddNewMessageToUI()) {
              if (event.thread.lastMessage) {
                onAddMessageToUI(event.thread.lastMessage);
                scrollToBottom();
              }
            }
          }
        }
      },
      onChatMessageThreadDestroyed: (event: ChatMessageThreadEvent) => {
        const msgId = event.thread.msgId;
        if (msgId) {
          onRemoveMessageThreadToUI(msgId);
        }
      },
      onChatMessageThreadUserRemoved: (_event: ChatMessageThreadEvent) => {},
    } as MessageServiceListener;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [
    convId,
    im,
    onUpdateMessageThreadToUI,
    onRemoveMessageThreadToUI,
    updateMessageEmojiToUI,
    comType,
    canAddNewMessageToUI,
    onAddMessageToUI,
    scrollToBottom,
  ]);

  React.useEffect(() => {
    onInit();
  }, [onInit]);

  // console.log('test:zuoyu:useMessageList', comType, convId, convType);

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
    // refreshing: enableRefresh === true ? refreshing : undefined,
    // onRefresh: enableRefresh === true ? _onRefresh : undefined,
    // onMore: enableMore === true ? _onMore : undefined,
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
    onInit,
    onTouchMove,
  };
}
