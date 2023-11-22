import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';

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
  const { onClicked, onLongPressed, testMode } = props;
  const dataRef = React.useRef<ConversationListItemProps[]>([]);
  const [data, setData] = React.useState<
    ReadonlyArray<ConversationListItemProps>
  >(dataRef.current);
  const listType = React.useRef<'FlatList' | 'SectionList'>('FlatList').current;
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, _setListState] = React.useState<ListState>('normal');
  const isAutoLoad = React.useRef(true).current;
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
  const sort: (
    prevProps: ConversationListItemProps,
    nextProps: ConversationListItemProps
  ) => boolean = () => true;

  const im = useChatContext();
  console.log('test:zuoyu:', testMode);

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

  const init = async () => {
    if (testMode === 'only-ui') {
      const array = Array.from({ length: 1 }, (_, index) => ({
        id: index.toString(),
      }));
      const testList = array.map((item) => {
        return {
          id: item.id,
          data: {
            convId: item.id,
            convType: 0,
            convAvatar: 'https://i.pravatar.cc/300',
            convName: 'user',
            unreadMessageCount: 1,
          },
          onLongPressed: onLongPressedRef.current,
          onClicked: onClickedRef.current,
        } as ConversationListItemProps;
      });
      setData(testList);
      return;
    }
    if (isAutoLoad === true) {
      const s = await im.loginState();
      if (s === 'logged') {
        im.getAllConversations({
          onResult: (result) => {
            const { isOk, value: list, error } = result;
            if (isOk && list) {
              for (const conv of list) {
                dataRef.current.push({
                  id: conv.convId,
                  data: conv,
                  onLongPressed: onLongPressedRef.current,
                  onClicked: onClickedRef.current,
                });
              }
              if (isShowAfterLoaded === true) {
                setData([...dataRef.current]);
              }
            } else {
              console.log('error', error);
            }
          },
        });
      }
    }
  };
  const unInit = () => {};

  useLifecycle(
    React.useCallback(async (state: any) => {
      console.log('test:zuoyu:', state);
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
    setData([...dataRef.current]);
  };
  const onPin = async (conv: ConversationModel) => {
    await im.setConversationPin({
      convId: conv.convId,
      convType: conv.convType,
      isPin: !conv.isPinned,
    });
    setData([...dataRef.current]);
  };
  const onDisturb = React.useCallback(
    async (conv: ConversationModel) => {
      await im.setConversationSilentMode({
        convId: conv.convId,
        convType: conv.convType,
        doNotDisturb: !conv.doNotDisturb,
      });
      setData([...dataRef.current]);
    },
    [im]
  );
  const onRead = (conv: ConversationModel) => {
    im.setConversationRead({
      convId: conv.convId,
      convType: conv.convType,
    });
    setData([...dataRef.current]);
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
    isLoadAll,
    isShowAfterLoaded,
    loadType,
    isVisibleUpdate,
    isAutoUpdate,
    isEventUpdate,
    ListItem,
    sort,
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
