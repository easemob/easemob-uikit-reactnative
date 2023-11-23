import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';
import { ChatMessageType } from 'react-native-chat-sdk';

import { ConversationModel, useChatContext } from '../../chat';
import { useDelayExecTask, useLifecycle } from '../../hook';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { ListState, UseFlatListReturn, UseListReturn } from '../types';
import type {
  ConversationListItemProps,
  useConversationListProps,
  UseConversationListReturn,
} from './types';

export function useConversationList(
  props: useConversationListProps
): UseFlatListReturn<ConversationListItemProps> &
  UseListReturn &
  UseConversationListReturn {
  const {
    onClicked,
    onLongPressed,
    testMode,
    onRequestMultiData,
    onSort: propsOnSort,
  } = props;
  const dataRef = React.useRef<ConversationListItemProps[]>([]);
  const [data, setData] = React.useState<
    ReadonlyArray<ConversationListItemProps>
  >(dataRef.current);
  const listType = React.useRef<'FlatList' | 'SectionList'>('FlatList').current;
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, setListState] = React.useState<ListState>(
    testMode === 'only-ui' ? 'normal' : 'loading'
  );
  const isAutoLoad = React.useRef(true).current;
  const isSort = React.useRef(true).current;
  const isLoadAll = React.useRef(true).current;
  const isShowAfterLoaded = React.useRef(true).current;
  const isVisibleUpdate = React.useRef(false).current;
  const isAutoUpdate = React.useRef(false).current;
  const isEventUpdate = React.useRef(true).current;
  const enableRefresh = React.useRef(false).current;
  const enableMore = React.useRef(false).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const ListItem: React.ComponentType<ConversationListItemProps> = () => null;

  const viewabilityConfigRef = React.useRef<ViewabilityConfig>({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    itemVisiblePercentThreshold: 50,
    waitForInteraction: false,
  });
  const { delayExecTask: onViewableItemsChanged } = useDelayExecTask(
    500,
    React.useCallback(
      (_info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => {},
      []
    )
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const onMore = () => {};
  const onSort = (
    prevProps: ConversationListItemProps,
    nextProps: ConversationListItemProps
  ): number => {
    if (propsOnSort) {
      return propsOnSort(prevProps, nextProps);
    } else {
      return sortConversations(prevProps, nextProps);
    }
  };

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

  const onSetData = (list: ConversationListItemProps[]) => {
    if (isSort === true) {
      list.sort(onSort);
    }
    console.log('test:zuoyu:onSetData', JSON.stringify(list));
    setData([...list]);
  };

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
              setListState('normal');
              im.sendFinished({ event: 'getAllConversations' });
            } else {
              setListState('error');
              if (error) {
                im.sendError({ error });
              }
            }
          },
        });
      }
    }
  };
  const unInit = () => {};

  useLifecycle(
    React.useCallback(async (state: any) => {
      if (state === 'load') {
        init();
      } else if (state === 'unload') {
        unInit();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const onRemove = async (conv: ConversationModel) => {
    await im.removeConversation({ convId: conv.convId });
    dataRef.current = dataRef.current.filter((item) => item.id !== conv.convId);
    onSetData(dataRef.current);
  };
  const onPin = async (conv: ConversationModel) => {
    await im.setConversationPin({
      convId: conv.convId,
      convType: conv.convType,
      isPin: !conv.isPinned,
    });
    onSetData(dataRef.current);
  };
  const onDisturb = async (conv: ConversationModel) => {
    await im.setConversationSilentMode({
      convId: conv.convId,
      convType: conv.convType,
      doNotDisturb: !conv.doNotDisturb,
    });
    onSetData(dataRef.current);
  };
  const onRead = (conv: ConversationModel) => {
    im.setConversationRead({
      convId: conv.convId,
      convType: conv.convType,
    });
    onSetData(dataRef.current);
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
          onPress: () => {
            alertRef.current?.close?.();
            onRemove(conv);
          },
        },
      ],
    });
  };

  return {
    data,
    listState,
    listType,
    onRefresh: enableRefresh === true ? onRefresh : undefined,
    onMore: enableMore === true ? onMore : undefined,
    isAutoLoad,
    isSort,
    isLoadAll,
    isShowAfterLoaded,
    loadType,
    isVisibleUpdate,
    isAutoUpdate,
    isEventUpdate,
    ListItem,
    onSort,
    refreshing: enableRefresh === true ? refreshing : undefined,
    viewabilityConfig:
      isVisibleUpdate === true ? viewabilityConfigRef.current : undefined,
    onViewableItemsChanged:
      isVisibleUpdate === true ? onViewableItemsChanged : undefined,
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
