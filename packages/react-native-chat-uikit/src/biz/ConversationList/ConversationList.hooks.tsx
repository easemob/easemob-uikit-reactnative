import * as React from 'react';
import {
  ChatConversationType,
  ChatMessage,
  ChatMessageType,
  ChatMultiDeviceEvent,
} from 'react-native-chat-sdk';

// import type { ChatMultiDeviceEvent as ChatMultiDeviceEventType } from 'react-native-chat-sdk';
// import {
//   ChatMessageType,
//   type ChatMultiDeviceEvent,
// } from 'react-native-chat-sdk';
import {
  ChatServiceListener,
  ConversationModel,
  gNewRequestConversationId,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import type { UIKitError } from '../../error';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { FlatListRef } from '../../ui/FlatList';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useConversationListMoreActions } from '../hooks/useConversationListMoreActions';
import { useConversationLongPressActions } from '../hooks/useConversationLongPressActions';
import { useFlatList } from '../List';
import type { ListState } from '../types';
import { ConversationListItemMemo } from './ConversationList.item';
import type {
  ConversationListItemComponentType,
  ConversationListItemProps,
  UseConversationListProps,
} from './types';

export function useConversationList(props: UseConversationListProps) {
  const {
    onClicked,
    onLongPressed,
    testMode,
    onRequestMultiData,
    onSort: propsOnSort,
    onClickedNewContact,
    onClickedNewConversation,
    onClickedNewGroup,
    ListItemRender: propsListItemRender,
    onStateChanged,
    propsRef,
    flatListProps: propsFlatListProps,
    onInitNavigationBarMenu,
    onInitBottomMenu,
    onInitialized,
  } = props;
  const flatListProps = useFlatList<ConversationListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    // onInit: () => init(),
  });
  const {
    ref: flatListRef,
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
  const [avatarUrl, setAvatarUrl] = React.useState<string>();
  const { tr } = useI18nContext();
  const alertRef = React.useRef<AlertRef>(null);
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const { closeMenu } = useCloseMenu({ menuRef });
  const ListItemRenderRef = React.useRef<ConversationListItemComponentType>(
    propsListItemRender ?? ConversationListItemMemo
  );
  const { onShowConversationListMoreActions } = useConversationListMoreActions({
    alertRef,
    menuRef,
    onClickedNewContact,
    onClickedNewConversation,
    onClickedNewGroup,
    onInit: onInitNavigationBarMenu,
  });
  const im = useChatContext();

  const onSetState = React.useCallback(
    (state: ListState) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

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

  const onLongPressedRef = React.useRef(
    (data?: ConversationModel | undefined) => {
      if (data) {
        if (onLongPressed) {
          onLongPressed(data);
        } else {
          onShowConversationLongPressActions(data);
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

  const onUpdateData = React.useCallback(
    (conv: ConversationModel) => {
      for (const item of dataRef.current) {
        if (conv.convId === item.data.convId) {
          item.data = conv;
          item.data = { ...item.data };
          break;
        }
      }
      onSetData(dataRef.current);
    },
    [dataRef, onSetData]
  );

  const init = React.useCallback(
    async (params: { onFinished?: () => void }) => {
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
      im.setOnRequestData(onRequestMultiData);
      if (isAutoLoad === true) {
        const url = im.user(im.userId)?.avatarURL;
        if (url) {
          setAvatarUrl(url);
        }

        const s = await im.loginState();
        if (s === 'logged') {
          im.getAllConversations({
            onResult: (result) => {
              const { isOk, value: list, error } = result;
              if (isOk && list) {
                dataRef.current = [];
                if (list) {
                  for (const conv of list) {
                    if (conv.convId === gNewRequestConversationId) {
                      continue;
                    }
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
                onSetState('normal');
                im.sendFinished({ event: 'getAllConversations' });
              } else {
                onSetState('error');
                if (error) {
                  im.sendError({ error });
                }
              }
              params.onFinished?.();
            },
          });
        } else {
          onSetState('error');
        }
      }
    },
    [
      dataRef,
      im,
      isAutoLoad,
      isShowAfterLoaded,
      onRequestMultiData,
      onSetData,
      onSetState,
      testMode,
    ]
  );

  const onRemoveById = React.useCallback(
    async (convId: string) => {
      await im.removeConversation({ convId: convId });
      dataRef.current = dataRef.current.filter((item) => item.id !== convId);
      onSetData(dataRef.current);
    },
    [dataRef, im, onSetData]
  );

  const onRemove = async (conv: ConversationModel) => {
    onRemoveById(conv.convId);
  };

  const onPin = React.useCallback(
    async (conv: ConversationModel) => {
      try {
        const isPinned = conv.isPinned ?? true;
        let isExist = false;
        for (const item of dataRef.current) {
          if (item.data.convId === conv.convId) {
            item.data.isPinned = conv.isPinned;
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
          // onSetData(dataRef.current);
        }
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [dataRef, im]
  );
  const onDisturb = React.useCallback(
    async (conv: ConversationModel) => {
      try {
        const isDisturb = conv.doNotDisturb ?? true;
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
          // onSetData(dataRef.current);
        }
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [dataRef, im]
  );
  const onRead = React.useCallback(
    (conv: ConversationModel) => {
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
          // onSetData(dataRef.current);
        }
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [dataRef, im]
  );

  const onLastMessage = React.useCallback(
    (conv: ConversationModel) => {
      try {
        let isExist = false;
        for (const item of dataRef.current) {
          if (item.data.convId === conv.convId) {
            item.data.lastMessage = conv.lastMessage;
            item.data = { ...item.data };
            isExist = true;
            break;
          }
        }
        if (isExist === true && conv.lastMessage) {
          im.setConversationMsg({
            convId: conv.convId,
            convType: conv.convType,
            lastMessage: conv.lastMessage,
          });
          // onSetData(dataRef.current);
        }
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [dataRef, im]
  );

  const onExt = React.useCallback(
    (conv: ConversationModel) => {
      try {
        let isExist = false;
        for (const item of dataRef.current) {
          if (item.data.convId === conv.convId) {
            item.data.ext = conv.ext;
            item.data = { ...item.data };
            isExist = true;
            break;
          }
        }
        if (isExist === true && conv.ext) {
          im.setConversationExt({
            convId: conv.convId,
            convType: conv.convType,
            ext: conv.ext,
          });
          // onSetData(dataRef.current);
        }
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [dataRef, im]
  );

  const pinConv = React.useCallback(
    (convId: string, convType: number) => {
      const conv = dataRef.current.find((item) => {
        return item.data.convId === convId && item.data.convType === convType;
      });
      console.log('test:zuoyu:pinConv:2', conv);
      if (conv && conv.data.isPinned !== true) {
        onPin({ ...conv.data, isPinned: true });
      }
    },
    [dataRef, onPin]
  );
  const unPinConv = React.useCallback(
    (convId: string, convType: number) => {
      const conv = dataRef.current.find((item) => {
        return item.data.convId === convId && item.data.convType === convType;
      });
      console.log('test:zuoyu:unPinConv:2', conv);
      if (conv && conv.data.isPinned === true) {
        onPin({ ...conv.data, isPinned: false });
      }
    },
    [dataRef, onPin]
  );

  const { onShowConversationLongPressActions } =
    useConversationLongPressActions({
      menuRef,
      alertRef,
      onDisturb,
      onPin,
      onRead,
      onRemove,
      onInit: onInitBottomMenu,
    });

  const onMessage = React.useCallback(
    (msgs: ChatMessage[]) => {
      for (const msg of msgs) {
        for (const item of dataRef.current) {
          if (item.data.convId === msg.conversationId) {
            item.data.lastMessage = msg;
            if (item.data.doNotDisturb !== true) {
              if (im.getCurrentConversation()?.convId === msg.conversationId) {
                item.data.unreadMessageCount = 0;
              } else {
                if (item.data.unreadMessageCount === undefined) {
                  item.data.unreadMessageCount = 0;
                }
                item.data.unreadMessageCount += 1;
              }
            } else {
              item.data.unreadMessageCount = undefined;
            }
            item.data = { ...item.data };
            break;
          }
        }
      }
      onSetData(dataRef.current);
    },
    [dataRef, im, onSetData]
  );

  const listener = React.useMemo(() => {
    return {
      onMessagesReceived: (msgs) => {
        onMessage(msgs);
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
        init({ onFinished: onInitialized });
      },
      onConversationRead: () => {},
      onMessageContentChanged: () => {
        // todo:
      },
      onConversationChanged: (conv: ConversationModel) => {
        onUpdateData(conv);
      },

      onMemberRemoved: (params: { groupId: string; groupName?: string }) => {
        // todo: remove conversation item.
        onRemoveById(params.groupId);
      },
      onDestroyed: (params: { groupId: string; groupName?: string }) => {
        onRemoveById(params.groupId);
      },
      onQuitGroup: (groupId) => {
        onRemoveById(groupId);
      },

      onConversationEvent: (
        event?: ChatMultiDeviceEvent,
        convId?: string,
        convType?: ChatConversationType
      ) => {
        if (event === ChatMultiDeviceEvent.CONVERSATION_DELETED) {
          if (convId) {
            onRemoveById(convId);
          }
        } else if (event === ChatMultiDeviceEvent.CONVERSATION_PINNED) {
          if (convId && convType !== undefined) {
            pinConv(convId, convType);
          }
        } else if (event === ChatMultiDeviceEvent.CONVERSATION_UNPINNED) {
          if (convId && convType !== undefined) {
            unPinConv(convId, convType);
          }
        }
      },
    } as ChatServiceListener;
  }, [
    dataRef,
    init,
    onInitialized,
    onMessage,
    onRemoveById,
    onSetData,
    onUpdateData,
    pinConv,
    unPinConv,
  ]);

  useChatListener(listener);

  React.useEffect(() => {
    const listener = {
      onSendMessageChanged: (msg: ChatMessage) => {
        onMessage([msg]);
      },
      onRecvRecallMessage: (_orgMsg: ChatMessage, tipMsg: ChatMessage) => {
        onMessage([tipMsg]);
      },
      onRecallMessageResult: (params: {
        isOk: boolean;
        orgMsg?: ChatMessage;
        tipMsg?: ChatMessage;
      }) => {
        if (params.isOk === true) {
          if (params.orgMsg && params.tipMsg) {
            onMessage([params.tipMsg]);
          }
        }
      },
    } as MessageManagerListener;
    im.messageManager.addListener('conv_list', listener);
    return () => {
      im.messageManager.removeListener('conv_list');
    };
  }, [im.messageManager, onMessage]);

  React.useEffect(() => {
    init({ onFinished: onInitialized });
  }, [init, onInitialized]);

  if (propsRef && propsRef.current) {
    propsRef.current.closeMenu = () => closeMenu();
    propsRef.current.deleteItem = (conv) => onRemove(conv);
    propsRef.current.getAlertRef = () => alertRef;
    propsRef.current.getMenuRef = () => menuRef;
    propsRef.current.getFlatListRef = () =>
      flatListRef as React.RefObject<FlatListRef<ConversationListItemProps>>;
    propsRef.current.getList = () => dataRef.current.map((item) => item.data);
    propsRef.current.refreshList = () => {
      onSetData(dataRef.current);
    };
    propsRef.current.reloadList = () => {
      init({ onFinished: onInitialized });
    };
    propsRef.current.showMenu = () => {
      onShowConversationListMoreActions();
    };
    propsRef.current.updateItem = (conv: ConversationModel) => {
      const isExisted = dataRef.current.find((item) => {
        return item.data.convId === conv.convId;
      });
      if (isExisted) {
        if (
          isExisted.data.unreadMessageCount !== conv.unreadMessageCount &&
          conv.unreadMessageCount === 0
        ) {
          onRead(conv);
        }
        if (isExisted.data.lastMessage !== conv.lastMessage) {
          onLastMessage(conv);
        }
        if (isExisted.data.doNotDisturb !== conv.doNotDisturb) {
          onDisturb(conv);
        }
        if (isExisted.data.ext !== conv.ext) {
          onExt(conv);
        }
        if (isExisted.data.isPinned !== conv.isPinned) {
          onPin(conv);
        }
      }
    };
  }

  return {
    ...flatListProps,
    propsFlatListProps,
    listType,
    listState,
    data,
    onRemove,
    onPin,
    onDisturb,
    onRead,
    onRequestCloseMenu: closeMenu,
    menuRef,
    alertRef,
    avatarUrl,
    tr,
    onShowConversationListMoreActions,
    ListItemRender: ListItemRenderRef.current,
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
