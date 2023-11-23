import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';

import { ConversationModel, useChatContext } from '../../chat';
import { useDelayExecTask, useLifecycle } from '../../hook';
import type { ListState, UseFlatListReturn, UseListReturn } from '../types';
import type {
  SearchConversationItemProps,
  useSearchConversationProps,
} from './types';

export function useSearchConversation(
  props: useSearchConversationProps
): UseFlatListReturn<SearchConversationItemProps> & UseListReturn {
  const { onClicked, testMode } = props;
  const dataRef = React.useRef<SearchConversationItemProps[]>([]);
  const [data, setData] = React.useState<
    ReadonlyArray<SearchConversationItemProps>
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
  const ListItem: React.ComponentType<SearchConversationItemProps> = () => null;

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
      ...dataRef.current.filter((item) => item.data.convName?.includes(key)),
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
    prevProps: SearchConversationItemProps,
    nextProps: SearchConversationItemProps
  ) => number = () => 0;

  const onClickedRef = React.useRef((data?: ConversationModel | undefined) => {
    if (data) {
      if (onClicked) {
        onClicked(data);
      }
    }
  });

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
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
                  id: conv.convId,
                  data: conv,
                  onClicked: onClickedRef.current,
                });
              }
              if (isShowAfterLoaded === false) {
                setData([]);
              }
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
    refreshing: enableRefresh === true ? refreshing : undefined,
    viewabilityConfig:
      isVisibleUpdate === true ? viewabilityConfigRef.current : undefined,
    onViewableItemsChanged:
      isVisibleUpdate === true ? onViewableItemsChanged : undefined,
  };
}
