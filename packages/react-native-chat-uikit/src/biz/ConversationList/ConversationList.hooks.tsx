import * as React from 'react';
import { ChatMessageType } from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  ConversationModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { UIKitError } from '../../error';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useFlatList } from '../List';
import type { UseFlatListReturn } from '../types';
import type {
  ConversationListItemProps,
  UseConversationListProps,
  UseConversationListReturn,
} from './types';

export function useConversationList(
  props: UseConversationListProps
): UseFlatListReturn<ConversationListItemProps> & UseConversationListReturn {
  const {
    onClicked,
    onLongPressed,
    testMode,
    onRequestMultiData,
    onSort: propsOnSort,
  } = props;
  const flatListProps = useFlatList<ConversationListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    onInit: () => init(),
  });
  const {
    data,
    setData,
    dataRef,
    isSort,
    isAutoLoad,
    setListState,
    listState,
    isShowAfterLoaded,
    listType,
  } = flatListProps;

  const onSort = React.useCallback(
    (
      prevProps: ConversationListItemProps,
      nextProps: ConversationListItemProps
    ): number => {
      if (propsOnSort) {
        return propsOnSort(prevProps, nextProps);
      } else {
        return sortConversations(prevProps, nextProps);
      }
    },
    [propsOnSort]
  );

  const im = useChatContext();

  const onLongPressedRef = React.useRef(
    (data?: ConversationModel | undefined) => {
      if (data) {
        if (onLongPressed) {
          onLongPressed(data);
        } else {
          onShowMenu(data);
        }
      }
    }
  );
  const onClickedRef = React.useRef((data?: ConversationModel | undefined) => {
    if (data) {
      if (onClicked) {
        onClicked(data);
      }
    }
  });

  const onSetData = React.useCallback(
    (list: ConversationListItemProps[]) => {
      if (isSort === true) {
        list.sort(onSort);
      }
      setData([...list]);
    },
    [isSort, onSort, setData]
  );

  const init = async () => {
    if (testMode === 'only-ui') {
      const array = Array.from({ length: 10 }, (_, index) => ({
        id: index.toString(),
      }));
      const testList = array.map((item, i) => {
        return {
          id: item.id,
          data: {
            convId: item.id,
            convType: i % 2 === 0 ? 0 : 1,
            convAvatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            convName: 'user',
            unreadMessageCount: 1,
            isPinned: i % 2 === 0,
            lastMessage:
              i % 4 === 0
                ? undefined
                : {
                    localTime: new Date().getTime() + i * 1000 * 60,
                    body: { type: ChatMessageType.TXT, content: 'hello' },
                  },
          },
          onLongPressed: onLongPressedRef.current,
          onClicked: onClickedRef.current,
        } as ConversationListItemProps;
      });
      onSetData(testList);
      return;
    }
    if (isAutoLoad === true) {
      im.setOnRequestMultiData(onRequestMultiData);
      const s = await im.loginState();
      if (s === 'logged') {
        im.getAllConversations({
          onResult: (result) => {
            const { isOk, value: list, error } = result;
            if (isOk && list) {
              dataRef.current = [];
              if (list) {
                for (const conv of list) {
                  dataRef.current.push({
                    id: conv.convId,
                    data: conv,
                    onLongPressed: onLongPressedRef.current,
                    onClicked: onClickedRef.current,
                  });
                }
                if (isShowAfterLoaded === true) {
                  onSetData(dataRef.current);
                }
              }
              setListState?.('normal');
              im.sendFinished({ event: 'getAllConversations' });
            } else {
              setListState?.('error');
              if (error) {
                im.sendError({ error });
              }
            }
          },
        });
      }
    }
  };

  const onRemove = async (conv: ConversationModel) => {
    await im.removeConversation({ convId: conv.convId });
    dataRef.current = dataRef.current.filter((item) => item.id !== conv.convId);
    onSetData(dataRef.current);
  };
  const onPin = async (conv: ConversationModel) => {
    try {
      const isPinned = !conv.isPinned;
      let isExist = false;
      for (const item of dataRef.current) {
        if (item.data.convId === conv.convId) {
          item.data.isPinned = isPinned;
          item.data = { ...item.data };
          isExist = true;
          break;
        }
      }
      if (isExist === true) {
        await im.setConversationPin({
          convId: conv.convId,
          convType: conv.convType,
          isPin: isPinned,
        });
        onSetData(dataRef.current);
      }
    } catch (error) {
      im.sendError({ error: error as UIKitError });
    }
  };
  const onDisturb = async (conv: ConversationModel) => {
    try {
      const isDisturb = !conv.doNotDisturb;
      let isExist = false;
      for (const item of dataRef.current) {
        if (item.data.convId === conv.convId) {
          item.data.doNotDisturb = isDisturb;
          item.data = { ...item.data };
          isExist = true;
          break;
        }
      }
      if (isExist === true) {
        await im.setConversationSilentMode({
          convId: conv.convId,
          convType: conv.convType,
          doNotDisturb: isDisturb,
        });
        onSetData(dataRef.current);
      }
    } catch (error) {
      im.sendError({ error: error as UIKitError });
    }
  };
  const onRead = (conv: ConversationModel) => {
    try {
      let isExist = false;
      for (const item of dataRef.current) {
        if (item.data.convId === conv.convId) {
          item.data.unreadMessageCount = 0;
          item.data = { ...item.data };
          isExist = true;
          break;
        }
      }
      if (isExist === true) {
        im.setConversationRead({
          convId: conv.convId,
          convType: conv.convType,
        });
        onSetData(dataRef.current);
      }
    } catch (error) {
      im.sendError({ error: error as UIKitError });
    }
  };

  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const onRequestModalClose = () => {
    menuRef.current?.startHide?.();
  };
  const onShowMenu = (conv: ConversationModel) => {
    menuRef.current?.startShowWithInit?.(
      [
        {
          name: conv.doNotDisturb ? 'Unmute' : 'Mute',
          isHigh: false,
          onClicked: () => {
            onDisturb(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: conv.isPinned ? 'Unpin' : 'Pin',
          isHigh: false,
          onClicked: () => {
            onPin(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: 'MakeRead',
          isHigh: false,
          onClicked: () => {
            onRead(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: 'Remove',
          isHigh: true,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              onShowAlert(conv);
            });
          },
        },
      ],
      { title: conv.convName }
    );
  };
  const alertRef = React.useRef<AlertRef>(null);
  const onShowAlert = (conv: ConversationModel) => {
    alertRef.current?.alertWithInit?.({
      title: 'Remove this conversation?',
      buttons: [
        {
          text: 'Cancel',
          onPress: () => {
            alertRef.current?.close?.();
          },
        },
        {
          text: 'Remove',
          isPreferred: true,
          onPress: () => {
            alertRef.current?.close?.();
            onRemove(conv);
          },
        },
      ],
    });
  };

  console.log('test:zuoyu:conv:list:', data.length);
  const listener = React.useMemo(() => {
    return {
      onMessagesReceived: (msgs) => {
        for (const msg of msgs) {
          for (const item of dataRef.current) {
            if (item.data.convId === msg.conversationId) {
              item.data.lastMessage = msg;
              if (item.data.doNotDisturb !== true) {
                if (item.data.unreadMessageCount === undefined) {
                  item.data.unreadMessageCount = 0;
                }
                item.data.unreadMessageCount += 1;
              }
              item.data = { ...item.data };
              break;
            }
          }
        }
        onSetData(dataRef.current);
      },
      onMessagesRecalled: async (msgs) => {
        for (const msg of msgs) {
          for (const item of dataRef.current) {
            if (item.data.convId === msg.conversationId) {
              // todo: update last message
              break;
            }
          }
        }
        onSetData(dataRef.current);
      },
      onConversationsUpdate: () => {
        // init();
      },
      onMessageContentChanged: () => {
        // todo:
      },
    } as ChatServiceListener;
  }, [dataRef, onSetData]);

  useChatListener(listener);

  // useChatListener({
  //   onMessagesReceived: (msgs) => {
  //     for (const msg of msgs) {
  //       for (const item of dataRef.current) {
  //         if (item.data.convId === msg.conversationId) {
  //           item.data.lastMessage = msg;
  //           if (item.data.doNotDisturb !== true) {
  //             if (item.data.unreadMessageCount === undefined) {
  //               item.data.unreadMessageCount = 0;
  //             }
  //             item.data.unreadMessageCount += 1;
  //           }
  //           item.data = { ...item.data };
  //           break;
  //         }
  //       }
  //     }
  //     onSetData(dataRef.current);
  //   },
  //   onMessagesRecalled: async (msgs) => {
  //     for (const msg of msgs) {
  //       for (const item of dataRef.current) {
  //         if (item.data.convId === msg.conversationId) {
  //           // todo: update last message
  //           break;
  //         }
  //       }
  //     }
  //     onSetData(dataRef.current);
  //   },
  //   onConversationsUpdate: () => {
  //     init();
  //   },
  //   onMessageContentChanged: () => {
  //     // todo:
  //   },
  // } as ChatServiceListener);

  return {
    listType,
    listState,
    data,
    onRemove,
    onPin,
    onDisturb,
    onRead,
    onRequestModalClose,
    menuRef,
    alertRef,
  };
}

export const sortConversations = (
  prevProps: ConversationListItemProps,
  nextProps: ConversationListItemProps
): number => {
  if (prevProps.data.isPinned !== nextProps.data.isPinned) {
    return prevProps.data.isPinned ? -1 : 1;
  }

  if (
    prevProps.data.lastMessage?.localTime &&
    nextProps.data.lastMessage?.localTime
  ) {
    if (
      prevProps.data.lastMessage.localTime ===
      nextProps.data.lastMessage.localTime
    ) {
      return 0;
    } else if (
      prevProps.data.lastMessage.localTime >
      nextProps.data.lastMessage.localTime
    ) {
      return -1;
    } else {
      return 1;
    }
  } else if (
    prevProps.data.lastMessage?.localTime ||
    nextProps.data.lastMessage?.localTime
  ) {
    return prevProps.data.lastMessage?.localTime ? 1 : -1;
  }

  return 0;
};
