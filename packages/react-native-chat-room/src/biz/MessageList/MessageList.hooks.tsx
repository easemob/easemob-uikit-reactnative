import * as React from 'react';
import {
  FlatList,
  Keyboard,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';

import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useDelayExecTask } from '../../hook';
import { useI18nContext } from '../../i18n';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
} from '../../rename.chat';
import {
  chatroom_uikit_gift,
  custom_msg_event_type_gift,
  custom_msg_event_type_join,
  GiftServiceData,
  RoomServiceListener,
  useRoomContext,
  useRoomListener,
} from '../../room';
import { seqId, timeoutTask } from '../../utils';
import { BottomSheetNameMenuRef, InitMenuItemsType } from '../BottomSheetMenu';
import { emoji as convert } from '../EmojiList';
import type {
  BottomSheetMessageReportRef,
  ReportItemModel,
} from '../MessageReport';
import { gIdleTimeout, gMaxMessageCount } from './MessageList.const';
import type {
  MessageListItemBasic,
  MessageListItemModel,
  MessageListItemProps,
} from './types';

export const useKeyboardOnAndroid = (isInputBarShow: boolean) => {
  const { addListener, removeListener, emit } = useDispatchContext();
  const [translateY, seTranslateY] = React.useState(0);
  const keyboardHeight = React.useRef(0);

  React.useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', (e) => {
      // !!! both ios and android
      if (Platform.OS !== 'ios') {
        keyboardHeight.current = e.endCoordinates.height;
        emit(`_$useKeyboardOnAndroid`, isInputBarShow, keyboardHeight.current);
      }
    });
    const s3 = Keyboard.addListener('keyboardDidHide', (e) => {
      // !!! both ios and android
      if (Platform.OS !== 'ios') {
        keyboardHeight.current = e.endCoordinates.height;
        emit(`_$useKeyboardOnAndroid`, isInputBarShow, keyboardHeight.current);
      }
    });
    return () => {
      s1.remove();
      s3.remove();
    };
  }, [emit, isInputBarShow]);

  React.useEffect(() => {
    const changeLayout = (isInputBarShow: boolean, keyboardHeight: number) => {
      if (keyboardHeight > 0) {
        if (isInputBarShow === true) {
          seTranslateY(keyboardHeight);
        } else {
          seTranslateY(0);
        }
      } else {
        seTranslateY(0);
      }
    };
    addListener(`_$${useKeyboardOnAndroid.name}`, changeLayout);
    return () => {
      removeListener(`_$${useKeyboardOnAndroid.name}`, changeLayout);
    };
  }, [addListener, removeListener]);

  return translateY;
};

export function useMessageListApi(params: {
  onLongPress?: (data: MessageListItemModel) => void;
  onUnreadCount?: (count: number) => void;
  onLayoutProps?: ((event: LayoutChangeEvent) => void) | undefined;
  maxMessageCount?: number;
  messageMenuItems: InitMenuItemsType[] | undefined;
}) {
  const {
    onLongPress: propsOnLongPress,
    onLayoutProps,
    onUnreadCount,
    maxMessageCount = gMaxMessageCount,
    messageMenuItems,
  } = params;
  const listRef = React.useRef<FlatList>({} as any);
  const dataRef = React.useRef<MessageListItemProps[]>([]);
  const [data, setData] = React.useState<MessageListItemProps[]>(
    dataRef.current
  );
  const unreadCount = React.useRef(0);
  const { emit } = useDispatchContext();

  const heightRef = React.useRef(0);

  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const reportRef = React.useRef<BottomSheetMessageReportRef>({} as any);

  // If idle for more than three seconds, the oldest messages will be cleared.
  const { delayExecTask: _startClearTask } = useDelayExecTask(
    gIdleTimeout,
    () => {
      if (dataRef.current.length > maxMessageCount) {
        dataRef.current.splice(0, dataRef.current.length - maxMessageCount);
        _updateUI(true);
      }
    }
  );

  const needScrollRef = React.useRef(true);
  const userScrollGestureRef = React.useRef(false);

  const im = useRoomContext();
  const { tr } = useI18nContext();
  const { roomOption, languageCode } = useConfigContext();

  const langPressItemRef = React.useRef<MessageListItemModel | undefined>();

  const _onLongPress = (item: MessageListItemModel) => {
    langPressItemRef.current = item;
    if (propsOnLongPress) {
      propsOnLongPress?.(item);
    } else {
      onShowMenu(item);
    }
  };

  const msgListener = React.useRef<RoomServiceListener>({
    onMessageReceived: (roomId, message) => {
      if (im.roomState === 'joined') {
        if (im.roomId === roomId) {
          if (message.body.type === ChatMessageType.TXT) {
            _onTextMessage(message);
          } else if (message.body.type === ChatMessageType.CUSTOM) {
            _onCustomMessage(message);
          }
        }
      }
    },
    onMessageRecalled: (roomId, message) => {
      if (im.roomState === 'joined') {
        if (im.roomId === roomId) {
          _updateUI(_delData(message.msgId));
        }
      }
    },
  });

  useRoomListener(msgListener.current);

  const _setNeedScroll = (needScroll: boolean) => {
    needScrollRef.current = needScroll;
  };
  const _setUserScrollGesture = (isUser: boolean) => {
    userScrollGestureRef.current = isUser;
  };
  const _needScroll = () => {
    return (
      needScrollRef.current === true && userScrollGestureRef.current === false
    );
  };
  const _setUnreadCount = (count: number) => {
    unreadCount.current = count;
    onUnreadCount?.(unreadCount.current);
  };

  const _addJoinData = (message: ChatMessage) => {
    const getNickName = () => {
      const user = im.userInfoFromMessage(message);
      return user?.nickname ?? user?.userId ?? message.from ?? 'unknown';
    };
    const part = {
      type: 'tip',
      msg: message,
      content: {
        text: tr('${0} Joined', getNickName()),
      },
    } as Pick<MessageListItemProps, 'type' | 'msg' | 'content'>;
    return _addCommonData(part);
  };
  const _addTextData = (message: ChatMessage, content?: string) => {
    const getContent = () => {
      if (content) return content;
      return convert.toCodePointText(
        (message.body as ChatTextMessageBody).content
      );
    };
    const part = {
      type: 'text',
      msg: message,
      content: {
        text: getContent(),
      },
    } as Pick<MessageListItemProps, 'type' | 'msg' | 'content'>;
    return _addCommonData(part);
  };
  const _addGiftData = (message: ChatMessage) => {
    const body = message.body as ChatCustomMessageBody;
    const jsonGift = (body.params as any)[chatroom_uikit_gift];
    if (jsonGift) {
      const gift = JSON.parse(jsonGift) as GiftServiceData;
      const part = {
        type: 'gift',
        msg: message,
        content: {
          gift: gift.giftIcon,
          text: tr("Sent '@${0}'", gift.giftName),
        },
      } as Pick<MessageListItemProps, 'type' | 'msg' | 'content'>;
      return _addCommonData(part);
    }
    return false;
  };
  const _addCommonData = (
    d: Pick<MessageListItemProps, 'type' | 'msg' | 'content'>
  ) => {
    const getBasic = (): MessageListItemBasic => {
      let user = im.getUserInfo(d.msg?.from);
      if (user === undefined || user.nickname === undefined) {
        user = im.userInfoFromMessage(d.msg);
      }
      const nickname =
        user?.nickname ?? user?.userId ?? d.msg?.from ?? 'unknown';
      return {
        timestamp: Date.now(),
        nickname: nickname,
        avatar: user?.avatarURL,
        tag: user?.identify,
      };
    };
    dataRef.current.push({
      id: `${seqId('_msg')}`,
      basic: getBasic(),
      action: {
        onStartPress: () => {},
        onLongPress: (data: MessageListItemModel) => {
          _setNeedScroll(false);
          _onLongPress(data);
        },
      },
      ...d,
    } as MessageListItemProps);
    return true;
  };

  const _delData = (msgId: string) => {
    for (let index = 0; index < dataRef.current.length; index++) {
      const item = dataRef.current[index];
      if (item?.msg?.msgId === msgId) {
        dataRef.current.splice(index, 1);
        return true;
      }
    }
    return false;
  };

  const _updateUI = (isNeedUpdate: boolean) => {
    if (isNeedUpdate === true) {
      setData([...dataRef.current]);
    }
  };

  const _onTextMessage = (message: ChatMessage) => {
    _updateUI(_addTextData(message));
    if (_needScroll() === false) {
      _setUnreadCount(unreadCount.current + 1);
      emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
    }
    _startClearTask();
    _scrollToEnd();
  };

  const _onCustomMessage = (message: ChatMessage) => {
    const body = message.body as ChatCustomMessageBody;
    if (body.event === custom_msg_event_type_gift) {
      if (roomOption.messageList.isVisibleGift === true) {
        _updateUI(_addGiftData(message));
        if (_needScroll() === false) {
          _setUnreadCount(unreadCount.current + 1);
          emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
        }
        _startClearTask();
        _scrollToEnd();
      }
    } else if (body.event === custom_msg_event_type_join) {
      _updateUI(_addJoinData(message));
    }
  };

  const _addTextMessage = (content: string, message?: ChatMessage) => {
    _updateUI(_addTextData(message!, content));
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
    _startClearTask();
    _scrollToEnd();
  };

  const _addJoinedMessage = (message: ChatMessage) => {
    _updateUI(_addJoinData(message));
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
    _startClearTask();
    _scrollToEnd();
  };

  const _addSendedMessage = (message: ChatMessage) => {
    if (message.body.type === ChatMessageType.CUSTOM) {
      const body = message.body as ChatCustomMessageBody;
      if (body.event === custom_msg_event_type_join) {
        _updateUI(_addJoinData(message));
      } else if (body.event === custom_msg_event_type_gift) {
        _updateUI(_addGiftData(message));
      } else {
        im.sendError({
          error: new UIKitError({ code: ErrorCode.enum }),
          from: 'MessageList',
        });
        return;
      }
    } else if (message.body.type === ChatMessageType.TXT) {
      _updateUI(_addTextData(message));
    } else {
      im.sendError({
        error: new UIKitError({ code: ErrorCode.enum }),
        from: 'MessageList',
      });
      return;
    }
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
    _startClearTask();
    _scrollToEnd();
  };

  const _scrollToEnd = () => {
    if (_needScroll() === true) {
      timeoutTask(0, () => listRef.current?.scrollToEnd?.());
    }
  };

  const _onEndReached = () => {
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
  };

  const { delayExecTask: _gestureHandler } = useDelayExecTask(
    500,
    (isBottom: boolean) => {
      if (userScrollGestureRef.current === false) {
        _setNeedScroll(isBottom === true);
      }
    }
  );

  const _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (userScrollGestureRef.current === true) {
      const y = event.nativeEvent.contentOffset.y;
      if (y + heightRef.current > event.nativeEvent.contentSize.height - 10) {
        _gestureHandler(true);
      } else {
        _gestureHandler(false);
      }
    }
  };

  const _scrollToLastMessage = () => {
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$useMessageListApi_updateUnreadCount`, unreadCount.current);
    _scrollToEnd();
  };

  const _onScrollEndDrag = () => {
    _setUserScrollGesture(false);
  };
  const _onScrollBeginDrag = () => {
    _setUserScrollGesture(true);
  };

  // !!! Both gestures and scrolling methods are triggered on the ios platform. However, the android platform only has gesture triggering.
  const _onMomentumScrollEnd = () => {};

  const _onLayout = (event: LayoutChangeEvent) => {
    onLayoutProps?.(event);
    heightRef.current = event.nativeEvent.layout.height;
  };

  const _translateMessage = (msg?: ChatMessage) => {
    if (msg) {
      im.translateMessage(msg, languageCode)
        .then((r) => {
          for (const item of dataRef.current) {
            if (item.msg) {
              if (item.msg.msgId === r.msgId) {
                if (
                  item.type === 'text' &&
                  r.body.type === ChatMessageType.TXT
                ) {
                  const key = languageCode;
                  const body = r.body as ChatTextMessageBody;
                  const t = body.translations?.[key] as string;
                  // (item.content as TextContent).text = t; // !!! Unable to trigger update.
                  item.content = { ...item.content, text: t };
                  _updateUI(true);
                }
                break;
              }
            }
          }
          im.sendFinished({ event: 'translate_message' });
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useMessageListApi?.caller?.name,
          });
        });
    }
  };

  const _pinMessage = (isPin: string, msg?: ChatMessage) => {
    if (msg) {
      if (isPin === 'unpin') {
        im.unPinMessage(msg)
          .then(() => {
            im.sendFinished({ event: 'unpin_message' });
          })
          .catch((e) => {
            im.sendError({
              error: e,
              from: useMessageListApi?.caller?.name,
            });
          });
      } else if (isPin === 'pin') {
        im.pinMessage(msg)
          .then(() => {
            im.sendFinished({ event: 'pin_message' });
          })
          .catch((e) => {
            im.sendError({
              error: e,
              from: useMessageListApi?.caller?.name,
            });
          });
      }
    }
  };
  const _deleteMessage = (msg?: ChatMessage) => {
    if (msg) {
      im.recallMessage(msg.msgId)
        .then(() => {
          for (let index = 0; index < dataRef.current.length; index++) {
            const item = dataRef.current[index];
            if (item?.msg?.msgId === msg.msgId) {
              dataRef.current.splice(index, 1);
              _updateUI(true);
              break;
            }
          }
          im.sendFinished({ event: 'recall_message' });
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useMessageListApi?.caller?.name,
          });
        });
    }
  };
  const _reportMessage = (_result?: ReportItemModel) => {
    if (langPressItemRef.current?.msg) {
      const msg = langPressItemRef.current.msg;
      im.reportMessage({
        messageId: msg.msgId,
        tag: _result?.tag ?? '',
        reason: tr(_result?.title ?? ''),
      })
        .then(() => {
          im.sendFinished({ event: 'report_message' });
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useMessageListApi?.caller?.name,
          });
        });
    }
  };

  const onShowMenu = async (item: MessageListItemModel) => {
    const from = item.msg?.from;
    let items: InitMenuItemsType[] = [];

    if (roomOption.messagePin.isVisible === true) {
      if (im.ownerId === im.userId) {
        let msgPinInfo = await item.msg?.getPinInfo;
        if (msgPinInfo) {
          items.push({
            name: 'Unpin',
            isHigh: false,
            onClicked: () => {
              _pinMessage('unpin', item.msg);
              menuRef?.current?.startHide?.();
            },
          });
        } else {
          items.push({
            name: 'Pin',
            isHigh: false,
            onClicked: () => {
              _pinMessage('pin', item.msg);
              menuRef?.current?.startHide?.();
            },
          });
        }
      }
    }

    if (from === im.userId) {
      items.push({
        name: 'Translate',
        isHigh: false,
        onClicked: () => {
          _translateMessage(item.msg);
          menuRef?.current?.startHide?.();
        },
      });
      items.push({
        name: 'Delete',
        isHigh: false,
        onClicked: () => {
          _deleteMessage(item.msg);
          menuRef?.current?.startHide?.();
        },
      });
      items.push({
        name: 'Report',
        isHigh: true,
        onClicked: () => {
          menuRef?.current?.startHide?.(() => {
            reportRef?.current?.startShow?.();
          });
        },
      });
    } else {
      items.push({
        name: 'Translate',
        isHigh: false,
        onClicked: () => {
          _translateMessage(item.msg);
          menuRef?.current?.startHide?.();
        },
      });
      items.push({
        name: 'Report',
        isHigh: true,
        onClicked: () => {
          menuRef?.current?.startHide?.(() => {
            reportRef?.current?.startShow?.();
          });
        },
      });
    }

    if (messageMenuItems && messageMenuItems.length > 0) {
      for (const propsItem of messageMenuItems) {
        items.push(propsItem);
      }
    }

    if (item.type === 'text') {
      menuRef?.current?.startShowWithInit?.(items, item.msg);
    }
  };

  return {
    data: data,
    listRef: listRef,
    addTextMessage: _addTextMessage,
    addJoinedMessage: _addJoinedMessage,
    addSendedMessage: _addSendedMessage,
    scrollToEnd: _scrollToEnd,
    onEndReached: _onEndReached,
    onScroll: _onScroll,
    scrollToLastMessage: _scrollToLastMessage,
    onScrollEndDrag: _onScrollEndDrag,
    onScrollBeginDrag: _onScrollBeginDrag,
    onLayout: _onLayout,
    onMomentumScrollEnd: _onMomentumScrollEnd,
    translateMessage: _translateMessage,
    deleteMessage: _deleteMessage,
    reportMessage: _reportMessage,
    menuRef,
    reportRef,
  };
}
