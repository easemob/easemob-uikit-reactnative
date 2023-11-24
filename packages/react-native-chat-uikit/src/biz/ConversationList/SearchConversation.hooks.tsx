import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';

import { useChatContext } from '../../chat';
import { useDelayExecTask, useLifecycle } from '../../hook';
import type { UseSearchReturn } from '../ListSearch';
import type { ListState, UseFlatListReturn } from '../types';
import type {
  ConversationSearchModel,
  UseSearchConversationProps,
} from './types';

export function useSearchConversation(
  props: UseSearchConversationProps
): UseFlatListReturn<ConversationSearchModel> &
  UseSearchReturn<ConversationSearchModel> {
  const { onClicked, testMode } = props;
  const dataRef = React.useRef<ConversationSearchModel[]>([]);
  const [data, setData] = React.useState<
    ReadonlyArray<ConversationSearchModel>
  >([]);
  const listType = React.useRef<'FlatList' | 'SectionList'>('FlatList').current;
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, _setListState] = React.useState<ListState>('normal');
  const isAutoLoad = React.useRef(true).current;
  const isSort = React.useRef(false).current;
  const isLoadAll = React.useRef(true).current;
  const isShowAfterLoaded = React.useRef(false).current;
  const isVisibleUpdate = React.useRef(false).current;
  const isAutoUpdate = React.useRef(false).current;
  const isEventUpdate = React.useRef(true).current;
  const enableRefresh = React.useRef(false).current;
  const enableMore = React.useRef(false).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const ListItem: React.ComponentType<ConversationSearchModel> = () => null;

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

  const onSearch = (key: string) => {
    setData([
      ...dataRef.current.filter((item) => item.convName?.includes(key)),
    ]);
  };
  const { delayExecTask: deferSearch } = useDelayExecTask(
    500,
    React.useCallback((key: string) => {
      onSearch(key);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const onMore = () => {};

  const onSort: (
    prevProps: ConversationSearchModel,
    nextProps: ConversationSearchModel
  ) => number = () => 0;

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
      const array = Array.from({ length: 10 }, (_, index) => ({
        id: index.toString(),
      }));
      const testList = array.map((item, i) => {
        return {
          convId: item.id,
          convType: i % 2 === 0 ? 0 : 1,
          convAvatar:
            'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
          convName: 'user',
          unreadMessageCount: 1,
          isPinned: i % 2 === 0,
          id: item.id,
          name: item.id + 'name',
        } as ConversationSearchModel;
      });
      setData(testList);
      return;
    }
    if (isAutoLoad === true) {
      im.getAllConversations({
        onResult: (result) => {
          const { isOk, value: list } = result;
          if (isOk && list) {
            if (list) {
              for (const conv of list) {
                dataRef.current.push({
                  ...conv,
                  id: conv.convId,
                  name: conv.convName ?? conv.convId,
                });
              }
              setData([...dataRef.current]);
            }
          }
        },
      });
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

  return {
    data,
    listState,
    listType,
    onRefresh: enableRefresh === true ? onRefresh : undefined,
    onMore: enableMore === true ? onMore : undefined,
    deferSearch,
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
    onClicked,
    refreshing: enableRefresh === true ? refreshing : undefined,
    viewabilityConfig:
      isVisibleUpdate === true ? viewabilityConfigRef.current : undefined,
    onViewableItemsChanged:
      isVisibleUpdate === true ? onViewableItemsChanged : undefined,
  };
}
