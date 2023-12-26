import * as React from 'react';
import { ChatMessageType } from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  ConversationModel,
  gNewRequestConversationId,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { UIKitError } from '../../error';
import { useI18nContext } from '../../i18n';
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
): UseFlatListReturn<ConversationListItemProps> &
  UseConversationListReturn & {
    avatarUrl: string | undefined;
    tr: (key: string, ...args: any[]) => string;
  } {
  const {
    onClicked,
    onLongPressed,
    testMode,
    onRequestMultiData,
    onSort: propsOnSort,
  } = props;
  const flatListProps = useFlatList<ConversationListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    // onInit: () => init(),
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
  const [avatarUrl, setAvatarUrl] = React.useState<string>();
  const { tr } = useI18nContext();

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

  const init = React.useCallback(async () => {
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
      const url = im.user(im.userId)?.avatarURL;
      console.log('test:zuoyu:avatar:url:', url);
      if (url) {
        setAvatarUrl(url);
      }
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
  }, [
    dataRef,
    im,
    isAutoLoad,
    isShowAfterLoaded,
    onRequestMultiData,
    onSetData,
    setListState,
    testMode,
  ]);

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
        // onSetData(dataRef.current);
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
        // onSetData(dataRef.current);
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
        // onSetData(dataRef.current);
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
          name: conv.doNotDisturb ? 'unmute' : 'mute',
          isHigh: false,
          onClicked: () => {
            onDisturb(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: conv.isPinned ? 'unpin' : 'pin',
          isHigh: false,
          onClicked: () => {
            onPin(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: '_uikit_conv_menu_read',
          isHigh: false,
          onClicked: () => {
            onRead(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: '_uikit_conv_menu_delete',
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
      title: tr('_uikit_conv_alert_title'),
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current?.close?.();
          },
        },
        {
          text: tr('remove'),
          isPreferred: true,
          onPress: () => {
            alertRef.current?.close?.();
            onRemove(conv);
          },
        },
      ],
    });
  };

  const listener = React.useMemo(() => {
    return {
      onMessagesReceived: (msgs) => {
        for (const msg of msgs) {
          for (const item of dataRef.current) {
            if (item.data.convId === msg.conversationId) {
              item.data.lastMessage = msg;
              if (item.data.doNotDisturb !== true) {
                if (
                  im.getCurrentConversation()?.convId === msg.conversationId
                ) {
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
        console.log('test:zuoyu:conv:list:onConversationsUpdate:');
        init();
      },
      onConversationRead: (from, to) => {
        console.log('test:zuoyu:conv:list:onConversationRead:', from, to);
      },
      onMessageContentChanged: () => {
        // todo:
      },
      onConversationChanged: (conv: ConversationModel) => {
        console.log('test:zuoyu:conv:list:onConversationChanged:', conv);
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
    } as ChatServiceListener;
  }, [dataRef, im, init, onRemoveById, onSetData, onUpdateData]);

  useChatListener(listener);

  React.useEffect(() => {
    init();
  }, [init]);

  return {
    ...flatListProps,
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
    avatarUrl,
    tr,
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
