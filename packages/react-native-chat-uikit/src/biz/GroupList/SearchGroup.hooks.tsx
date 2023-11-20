import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';

import { useDelayExecTask } from '../../hook';
import type { ListState, UseFlatListReturn, UseListReturn } from '../types';
import type { SearchGroupItemProps } from './SearchGroup.item';

export type useSearchGroupApiProps = {};
export function useSearchGroupApi(
  props: useSearchGroupApiProps
): UseFlatListReturn<SearchGroupItemProps> & UseListReturn {
  const {} = props;
  const [data, _setData] = React.useState<ReadonlyArray<SearchGroupItemProps>>([
    { id: '1' },
  ]);
  const listType = React.useRef<'FlatList' | 'SectionList'>('FlatList').current;
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, _setListState] = React.useState<ListState>('normal');
  const isLoadAll = React.useRef(true).current;
  const isShowAfterLoaded = React.useRef(true).current;
  const isVisibleUpdate = React.useRef(false).current;
  const isAutoUpdate = React.useRef(false).current;
  const isEventUpdate = React.useRef(true).current;
  const enableRefresh = React.useRef(false).current;
  const enableMore = React.useRef(false).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const ListItem: React.ComponentType<SearchGroupItemProps> = () => null;

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

  const onSearch = (_key: string) => {};
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

  const sort: (
    prevProps: SearchGroupItemProps,
    nextProps: SearchGroupItemProps
  ) => boolean = () => true;

  return {
    data,
    listState,
    listType,
    onRefresh: enableRefresh === true ? onRefresh : undefined,
    onMore: enableMore === true ? onMore : undefined,
    deferSearch,
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
  };
}
