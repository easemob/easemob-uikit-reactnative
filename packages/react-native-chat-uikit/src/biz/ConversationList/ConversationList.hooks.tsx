import * as React from 'react';
import {
  ChatConversationType,
  ChatMessage,
  ChatMessageType,
  ChatMultiDeviceEvent,
} from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  ConversationModel,
  gNewRequestConversationId,
  UIConversationListListener,
  UIGroupListListener,
  UIListenerType,
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
import type { ListStateType } from '../types';
import { ConversationListItemMemo } from './ConversationList.item';
import type {
  ConversationListItemComponentType,
  ConversationListItemProps,
  ConversationListProps,
} from './types';

export function useConversationList(props: ConversationListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    testMode,
    // onRequestMultiData,
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
    filterEmptyConversation,
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
  const im = useChatContext();

  const onAddContact = (userId: string) => {
    im.addNewContact({ userId });
  };

  const { onShowConversationListMoreActions } = useConversationListMoreActions({
    alertRef,
    menuRef,
    onClickedNewContact,
    onClickedNewConversation,
    onClickedNewGroup,
    onInit: onInitNavigationBarMenu,
    onAddContact: onAddContact,
  });

  const onSetState = React.useCallback(
    (state: ListStateType) => {
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
        const ret = onLongPressedItem?.(data);
        if (ret !== false) {
          onShowConversationLongPressActions(data);
        }
      }
    }
  );
  const onClickedRef = React.useRef((data?: ConversationModel | undefined) => {
    if (data) {
      onClickedItem?.(data);
    }
  });

  const removeDuplicateData = React.useCallback(
    (list: ConversationListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.data.convId === item.data.convId)
      );
      return uniqueList;
    },
    []
  );

  const refreshToUI = React.useCallback(
    (list: ConversationListItemProps[]) => {
      if (isSort === true) {
        list.sort(onSort);
      }
      dataRef.current = removeDuplicateData(list);
      setData([...dataRef.current]);
    },
    [dataRef, isSort, onSort, removeDuplicateData, setData]
  );

  const onAddDataToUI = React.useCallback(
    (conv: ConversationModel) => {
      dataRef.current.push({
        id: conv.convId,
        data: conv,
        onLongPressed: onLongPressedRef.current,
        onClicked: onClickedRef.current,
      });
      refreshToUI(dataRef.current);
    },
    [dataRef, refreshToUI]
  );

  const onUpdateDataToUI = React.useCallback(
    (conv: ConversationModel) => {
      for (const item of dataRef.current) {
        if (conv.convId === item.data.convId) {
          item.data = conv;
          item.data = { ...item.data };
          break;
        }
      }
      refreshToUI(dataRef.current);
    },
    [dataRef, refreshToUI]
  );

  const onRemoveDataToUI = React.useCallback(
    (conv: ConversationModel) => {
      const index = dataRef.current.findIndex((item) => {
        return conv.convId === item.data.convId;
      });
      if (index >= 0) {
        dataRef.current.splice(index, 1);
        refreshToUI(dataRef.current);
      }
    },
    [dataRef, refreshToUI]
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
        refreshToUI(testList);
        return;
      }
      // im.setOnRequestData(onRequestMultiData);
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
                    dataRef.current = dataRef.current.filter(
                      (item) => item.data.convId !== gNewRequestConversationId
                    );
                    if (filterEmptyConversation === true) {
                      dataRef.current = dataRef.current.filter(
                        (item) => item.data.lastMessage !== undefined
                      );
                    }
                    refreshToUI([...dataRef.current]);
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
      filterEmptyConversation,
      im,
      isAutoLoad,
      isShowAfterLoaded,
      onSetState,
      refreshToUI,
      testMode,
    ]
  );

  const onRemove = React.useCallback(
    (convId: string) => {
      onRemoveDataToUI({ convId, convType: 0 });
    },
    [onRemoveDataToUI]
  );

  const addConv = React.useCallback(
    async (conv: ConversationModel) => {
      const ret = await im.getConversation({
        convId: conv.convId,
        convType: conv.convType,
        fromNative: true,
        createIfNotExist: true,
      });
      if (ret) onAddDataToUI(ret);
    },
    [im, onAddDataToUI]
  );

  const removeConv = React.useCallback(
    async (conv: ConversationModel) => {
      // !!! Only when users actively delete the session, if they exit the group, be kicked out of the group, delete contact, add blacklist, etc., will not delete the session list.
      im.removeConversation({ convId: conv.convId });
    },
    [im]
  );

  const pinConv = React.useCallback(
    async (conv: ConversationModel) => {
      try {
        const isPinned = conv.isPinned ?? true;
        await im.setConversationPin({
          convId: conv.convId,
          convType: conv.convType,
          isPin: isPinned,
        });
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [im]
  );
  const disturbConv = React.useCallback(
    async (conv: ConversationModel) => {
      try {
        const isDisturb = conv.doNotDisturb ?? true;
        await im.setConversationSilentMode({
          convId: conv.convId,
          convType: conv.convType,
          doNotDisturb: isDisturb,
        });
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [im]
  );
  const readConv = React.useCallback(
    (conv: ConversationModel) => {
      try {
        im.setConversationRead({
          convId: conv.convId,
          convType: conv.convType,
        });
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [im]
  );

  const setConvExt = React.useCallback(
    (conv: ConversationModel) => {
      try {
        if (conv.ext) {
          im.setConversationExt({
            convId: conv.convId,
            convType: conv.convType,
            ext: conv.ext,
          });
          // refreshToUI(dataRef.current);
        }
      } catch (error) {
        im.sendError({ error: error as UIKitError });
      }
    },
    [im]
  );

  const onPin = React.useCallback(
    (convId: string, convType: number) => {
      const conv = dataRef.current.find((item) => {
        return item.data.convId === convId && item.data.convType === convType;
      });
      if (conv && conv.data.isPinned !== true) {
        pinConv({ ...conv.data, isPinned: true });
      }
    },
    [dataRef, pinConv]
  );
  const onUnPin = React.useCallback(
    (convId: string, convType: number) => {
      const conv = dataRef.current.find((item) => {
        return item.data.convId === convId && item.data.convType === convType;
      });
      if (conv && conv.data.isPinned === true) {
        pinConv({ ...conv.data, isPinned: false });
      }
    },
    [dataRef, pinConv]
  );

  const { onShowConversationLongPressActions } =
    useConversationLongPressActions({
      menuRef,
      alertRef,
      onDisturb: disturbConv,
      onPin: pinConv,
      onRead: readConv,
      onRemove: removeConv,
      onInit: onInitBottomMenu,
    });

  const onMessage = React.useCallback(
    async (msgs: ChatMessage[]) => {
      for (const msg of msgs) {
        let isExisted = false;
        for (const item of dataRef.current) {
          if (item.data.convId === msg.conversationId) {
            isExisted = true;
            item.data.lastMessage = msg;
            if (item.data.doNotDisturb !== true) {
              if (im.getCurrentConversation()?.convId === msg.conversationId) {
                item.data.unreadMessageCount = 0;
              } else {
                if (msg.from === im.userId) {
                } else {
                  if (item.data.unreadMessageCount === undefined) {
                    item.data.unreadMessageCount = 0;
                  }
                  item.data.unreadMessageCount += 1;
                }
              }
            } else {
              item.data.unreadMessageCount = undefined;
            }
            item.data = { ...item.data };
            break;
          }
        }
        if (isExisted === false) {
          const conv = await im.getConversation({
            convId: msg.conversationId,
            convType: msg.chatType as number as ChatConversationType,
            fromNative: true,
          });
          if (conv) {
            onAddDataToUI(conv);
          }
        }
      }
      refreshToUI(dataRef.current);
    },
    [dataRef, im, onAddDataToUI, refreshToUI]
  );

  const listener = React.useMemo(() => {
    return {
      onMessagesReceived: (msgs) => {
        onMessage(msgs);
      },
      onMessagesRecalled: async () => {
        // !!!: see `onRecvRecallMessage`
      },
      onConversationsUpdate: () => {
        // !!!: see `UIConversationListListener`
      },
      onConversationRead: () => {
        // !!!: see `UIConversationListListener`
      },
      onMessageContentChanged: (msg) => {
        onMessage([msg]);
      },

      onConversationEvent: (
        event?: ChatMultiDeviceEvent,
        convId?: string,
        convType?: ChatConversationType
      ) => {
        if (event === ChatMultiDeviceEvent.CONVERSATION_DELETED) {
          if (convId) {
            init({});
          }
        } else if (event === ChatMultiDeviceEvent.CONVERSATION_PINNED) {
          if (convId && convType !== undefined) {
            onPin(convId, convType);
          }
        } else if (event === ChatMultiDeviceEvent.CONVERSATION_UNPINNED) {
          if (convId && convType !== undefined) {
            onUnPin(convId, convType);
          }
        }
      },

      onDetailChanged: (group) => {
        if (group.groupName) {
          const isExisted = dataRef.current.find((item) => {
            return item.data.convId === group.groupId;
          });
          if (isExisted) {
            isExisted.data.convName = group.groupName;
            onUpdateDataToUI(isExisted.data);
          }
        }
      },
    } as ChatServiceListener;
  }, [onMessage, init, onPin, onUnPin, dataRef, onUpdateDataToUI]);

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
    const uiListener: UIConversationListListener = {
      onAddedEvent: (data) => {
        onAddDataToUI(data);
      },
      onUpdatedEvent: (data) => {
        onUpdateDataToUI(data);
      },
      onDeletedEvent: (data) => {
        onRemoveDataToUI(data);
      },
      onRequestRefreshEvent: () => {
        refreshToUI(dataRef.current);
      },
      onRequestReloadEvent: () => {
        init({ onFinished: onInitialized });
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [
    dataRef,
    im,
    init,
    onAddDataToUI,
    onInitialized,
    onRemoveDataToUI,
    onUpdateDataToUI,
    refreshToUI,
  ]);

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onUpdatedEvent: (data) => {
        const isExisted = dataRef.current.find((item) => {
          return item.data.convId === data.groupId;
        });
        if (isExisted) {
          if (data.groupName) {
            isExisted.data.convName = data.groupName;
            onUpdateDataToUI(isExisted.data);
          }
        }
      },
      onAddedEvent: (data) => {
        onAddDataToUI({
          convId: data.groupId,
          convType: 1,
          convName: data.groupName,
          convAvatar: data.groupAvatar,
        });
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [dataRef, im, onAddDataToUI, onUpdateDataToUI]);

  React.useEffect(() => {
    init({ onFinished: onInitialized });
  }, [init, onInitialized]);

  if (propsRef && propsRef.current) {
    propsRef.current.addItem = (conv) => addConv(conv);
    propsRef.current.closeMenu = () => closeMenu();
    propsRef.current.deleteItem = (conv) => removeConv(conv);
    propsRef.current.getAlertRef = () => alertRef;
    propsRef.current.getMenuRef = () => menuRef;
    propsRef.current.getFlatListRef = () =>
      flatListRef as React.RefObject<FlatListRef<ConversationListItemProps>>;
    propsRef.current.getList = () => dataRef.current.map((item) => item.data);
    propsRef.current.refreshList = () => {
      im.sendUIEvent(UIListenerType.Conversation, 'onRequestRefreshEvent');
    };
    propsRef.current.reloadList = () => {
      im.sendUIEvent(UIListenerType.Conversation, 'onRequestReloadEvent');
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
          readConv(conv);
        }
        if (isExisted.data.doNotDisturb !== conv.doNotDisturb) {
          disturbConv(conv);
        }
        if (isExisted.data.ext !== conv.ext) {
          setConvExt(conv);
        }
        if (isExisted.data.isPinned !== conv.isPinned) {
          pinConv(conv);
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
    onPin: pinConv,
    onDisturb: disturbConv,
    onRead: readConv,
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
