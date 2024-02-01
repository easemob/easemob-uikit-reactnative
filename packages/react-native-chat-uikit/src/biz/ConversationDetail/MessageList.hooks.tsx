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
  ChatMessageStatus,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import {
  gCustomMessageCardEventType,
  gMessageAttributeQuote,
  gMessageAttributeVoiceReadFlag,
  UIConversationListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { userInfoFromMessage } from '../../chat/utils';
import { useConfigContext } from '../../config';
// import { useDispatchContext } from '../../dispatch';
import { useDelayExecTask } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { LocalPath, seqId, timeoutTask } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { gReportMessageList } from '../const';
import { useMessageContext } from '../Context';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useMessageLongPressActions } from '../hooks/useMessageLongPressActions';
import { useFlatList } from '../List';
import type {
  BottomSheetMessageReportRef,
  ReportItemModel,
} from '../MessageReport';
import { gRequestMaxMessageCount } from './const';
import { MessageListItemMemo } from './MessageListItem';
import { getQuoteAttribute } from './MessageListItem.hooks';
import type {
  MessageAddPosition,
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
    convId,
    convType,
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
    messageLayoutType,
    onNoMoreMessage,
  } = props;
  const { tr } = useI18nContext();
  const flatListProps = useFlatList<MessageListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
    // onInit: () => init(),
    // onLoadMore: () => onRequestHistoryMessage(),
  });
  const {
    dataRef,
    setData,
    isAutoLoad,
    listState,
    listType,
    ref: listRef,
  } = flatListProps;

  const preBottomDataRef = React.useRef<MessageListItemProps>();
  const scrollEventThrottle = React.useRef(16).current;
  const needScrollRef = React.useRef(true);
  const userScrollGestureRef = React.useRef(false);
  const isBottomRef = React.useRef(true);
  const isTopRef = React.useRef(true);
  const heightRef = React.useRef(0);
  const bounces = React.useRef(true).current;
  const currentVoicePlayingRef = React.useRef<MessageModel | undefined>();
  const im = useChatContext();
  const startMsgIdRef = React.useRef('');
  const [maxListHeight, setMaxListHeight] = React.useState<number>(0);
  const enableListItemUserInfoUpdateFromMessage = React.useRef(false).current;
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
  const inverted = React.useRef(true).current;
  const currentReportMessageRef = React.useRef<MessageModel>();
  const { closeMenu } = useCloseMenu({ menuRef });
  const MessageListItemRef = React.useRef<MessageListItemComponentType>(
    propsListItemRenderProps?.ListItemRender ?? MessageListItemMemo
  );
  const listItemRenderPropsRef = React.useRef<MessageListItemRenders>({
    ...propsListItemRenderProps,
  });
  const { dispatchUserInfo } = useMessageContext();
  const { recallTimeout } = useConfigContext();

  const setNeedScroll = React.useCallback((needScroll: boolean) => {
    needScrollRef.current = needScroll;
  }, []);
  const setUserScrollGesture = React.useCallback((isUserScroll: boolean) => {
    userScrollGestureRef.current = isUserScroll;
  }, []);
  // const { addListener, removeListener, emit } = useDispatchContext();

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
          listRef?.current?.scrollToIndex?.({ index: 0, animated });
        });
      }
    },
    [listRef, needScrollToBottom]
  );

  const scrollTo = React.useCallback(
    (index: number, animated?: boolean) => {
      setNeedScroll(false);
      timeoutTask(0, () => {
        listRef?.current?.scrollToIndex?.({ index, animated, viewPosition: 1 });
      });
    },
    [listRef, setNeedScroll]
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
              if (msgModel.msg.localMsgId === tMsgModel.msg.localMsgId) {
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
          preBottomDataRef.current = dataRef.current[0];
        }
        _refreshToUI(dataRef.current);
      } else {
        const index = dataRef.current.findIndex((d) => {
          if (d.id === preBottomDataRef.current?.id) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          // !!!: Get the element after the specified position in the array and return
          const tmp = dataRef.current.slice(index);
          _refreshToUI(tmp);
        } else {
          _refreshToUI(dataRef.current);
        }
      }
    },
    [dataRef, removeDuplicateData, needScrollToBottom, _refreshToUI]
  );

  // !!! Both gestures and scrolling methods are triggered on the ios platform. However, the android platform only has gesture triggering.
  const onMomentumScrollEnd = React.useCallback(() => {}, []);

  const { delayExecTask } = useDelayExecTask(
    500,
    React.useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
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
      },
      [dataRef, refreshToUI, scrollTo, setNeedScroll]
    )
  );

  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      if (y + heightRef.current > event.nativeEvent.contentSize.height - 10) {
        isTopRef.current = true;
      } else {
        isTopRef.current = false;
      }
      if (y < 10) {
        isBottomRef.current = true;
      } else {
        isBottomRef.current = false;
      }
      if (userScrollGestureRef.current === true) {
        delayExecTask({ ...event });
      }
    },
    [delayExecTask]
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
  });

  const onClickedListItem = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      const ret = propsOnClicked?.(id, model);
      if (ret !== false) {
        if (model.modelType === 'message') {
          const msgModel = model as MessageModel;
          if (msgModel.msg.body.type === ChatMessageType.VOICE) {
            startVoicePlay(msgModel);
          }
        }
      }
    },
    [propsOnClicked, startVoicePlay]
  );

  const onLongPressListItem = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      const ret = propsOnLongPress?.(id, model);
      if (ret !== false) {
        onShowMessageLongPressActions(id, model);
      }
    },
    [onShowMessageLongPressActions, propsOnLongPress]
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
      if (pos === 'bottom') {
        dataRef.current = [d, ...dataRef.current];
      } else {
        dataRef.current = [...dataRef.current, d];
      }
      refreshToUI(dataRef.current);
    },
    [dataRef, im, refreshToUI]
  );

  const onAddMessageListToUI = React.useCallback(
    async (
      msgs: ChatMessage[],
      position: MessageAddPosition,
      onFinished?: (items: MessageListItemProps[]) => void
    ) => {
      const list = msgs.reverse().map(async (msg) => {
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
            return {
              userId: msg.from,
              modelType: 'message',
              layoutType:
                messageLayoutType ??
                (msg.from === im.userId ? 'right' : 'left'),
              msg: msg,
              quoteMsg: quoteMsg,
              userName: user?.name,
              userAvatar: user?.avatar,
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
      if (position === 'bottom') {
        dataRef.current = [...l, ...dataRef.current];
      } else {
        dataRef.current = [...dataRef.current, ...l];
      }
      refreshToUI(dataRef.current);
      onFinished?.(l as MessageListItemProps[]);
    },
    [dataRef, getStyle, im, messageLayoutType, refreshToUI]
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
    (msg: ChatMessage, quoteMsg?: ChatMessage) => {
      onAddDataToUI(
        {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: msg.from === im.userId ? 'right' : 'left',
            msg: msg,
            quoteMsg: quoteMsg,
          },
          containerStyle: getStyle(),
        },
        'bottom'
      );

      if (
        enableListItemUserInfoUpdateFromMessage === true &&
        msg.direction === ChatMessageDirection.RECEIVE
      ) {
        const userInfo = userInfoFromMessage(msg);
        if (userInfo) {
          dispatchUserInfo({ ...userInfo, userAvatar: userInfo.avatarURL });
        }
      }
    },
    [
      dispatchUserInfo,
      enableListItemUserInfoUpdateFromMessage,
      getStyle,
      im.userId,
      onAddDataToUI,
    ]
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
        'bottom'
      );
    },
    [getStyle, onAddDataToUI]
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
          convType as number as ChatMessageChatType
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
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
      } else if (value.type === 'voice') {
        const v = value as SendVoiceProps;
        const msg = ChatMessage.createVoiceMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
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
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
      } else if (value.type === 'video') {
        const v = value as SendVideoProps;
        const msg = ChatMessage.createVideoMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
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
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
      } else if (value.type === 'file') {
        const v = value as SendFileProps;
        const msg = ChatMessage.createFileMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
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
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
      } else if (value.type === 'card') {
        const card = value as SendCardProps;
        const msg = ChatMessage.createCustomMessage(
          convId,
          gCustomMessageCardEventType,
          convType as number as ChatMessageChatType,
          {
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
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
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
          },
          containerStyle: getStyle(),
        } as MessageListItemProps;
        onAddDataToUI(ret, 'bottom');
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
        onAddDataToUI(ret, 'bottom');
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
        onAddDataToUI(ret, 'bottom');
      }
      if (ret) {
        onFinished?.(ret);
        scrollToBottom();
      }
    },
    [
      convId,
      convType,
      getStyle,
      im,
      messageLayoutType,
      onAddDataToUI,
      scrollToBottom,
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

  const requestHistoryMessage = React.useCallback(() => {
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
          onAddMessageListToUI(msgs, 'top', (list) => {
            list.map((v) => {
              if (v.model.modelType === 'message') {
                const msgModel = v.model as MessageModel;
                sendRecvMessageReadAck(msgModel.msg);
              }
            });
          });
        }
      },
    });
  }, [
    convId,
    convType,
    im.messageManager,
    onAddMessageListToUI,
    onNoMoreMessage,
    sendRecvMessageReadAck,
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
        onInputHeightChange: (_height: number) => {
          // if (height > 0) {
          //   scrollToBottom();
          // }
        },
        editMessageFinished: (model) => {
          editMessage(model.msg);
        },
        scrollToBottom: () => {
          scrollToBottom();
        },
      };
    },
    [
      addSendMessageToUI,
      deleteMessage,
      editMessage,
      onAddMessageListToUI,
      onUpdateMessageToUI,
      recallMessage,
      scrollToBottom,
      sendMessageToServer,
      sendRecvMessageReadAck,
      setNeedScroll,
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
          const quoteAttributes = getQuoteAttribute(msg);
          if (quoteAttributes) {
            const quoteMsg = await im.getMessage({
              messageId: quoteAttributes.msgID,
            });
            onAddMessageToUI(msg, quoteMsg);
          } else {
            onAddMessageToUI(msg);
          }

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
    onMore: requestHistoryMessage,
    reportMessage: reportMessage,
    showReportMessage: showReportMessageMenu,
    reportData: reportDataRef.current,
    reportRef,
    onClickedItemAvatar: onClickedListItemAvatar,
    onClickedItemQuote: onClickedListItemQuote,
    onClickedItemState: onClickedListItemState,
    ListItemRender: MessageListItemRef.current,
    listItemRenderProps: listItemRenderPropsRef.current,
    scrollEventThrottle,
    onMomentumScrollEnd,
    onScrollEndDrag,
    onScrollBeginDrag,
    onScroll,
    onLayout,
    bounces,
    enableListItemUserInfoUpdateFromMessage,
    onContentSizeChange,
    onRenderItem,
  };
}
