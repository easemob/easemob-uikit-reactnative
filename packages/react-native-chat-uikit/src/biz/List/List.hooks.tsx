import * as React from 'react';
import type {
  DefaultSectionT,
  SectionListData,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';

import { useDelayExecTask, useLifecycle } from '../../hook';
import type { FlatListRef } from '../../ui/FlatList';
import type { SectionListRef } from '../../ui/SectionList';
import { ListIndex } from '../ListIndex';
import type { DefaultListIndexPropsT, ListStateType } from '../types';
import type { UseListBasicProps } from './types';

export function useListBasic<ItemT>(props: UseListBasicProps<ItemT>) {
  const {
    onVisibleItems,
    onRefresh: propsOnRefresh,
    // onSearch: propsOnSearch,
    onLoadMore: propsOnLoadMore,
    onInit,
    onUnInit,
  } = props;
  const listType = React.useRef<'FlatList' | 'SectionList'>('FlatList').current;
  const loadType = React.useRef<'once' | 'multiple'>(
    props.loadType ?? 'once'
  ).current;
  const [listState, setListState] = React.useState<ListStateType>(
    props.listState ?? 'normal'
  );
  const isAutoLoad = React.useRef(props.isAutoLoad ?? true).current;
  const isSort = React.useRef(props.isSort ?? true).current;
  const isLoadAll = React.useRef(props.isLoadAll ?? true).current;
  const isShowAfterLoaded = React.useRef(
    props.isShowAfterLoaded ?? true
  ).current;
  const isVisibleUpdate = React.useRef(props.isVisibleUpdate ?? false).current;
  const isAutoUpdate = React.useRef(props.isAutoUpdate ?? false).current;
  const isEventUpdate = React.useRef(props.isEventUpdate ?? true).current;
  const enableRefresh = React.useRef(props.onRefresh ? true : false).current;
  const enableMore = React.useRef(props.onLoadMore ? true : false).current;
  const [refreshing, setRefreshing] = React.useState(props.refreshing ?? false);
  const onSearchRef = React.useRef<(keyword: string) => void>({} as any);

  const viewabilityConfigRef = React.useRef<ViewabilityConfig>({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    itemVisiblePercentThreshold: 50,
    waitForInteraction: false,
  });
  const { delayExecTask: onViewableItemsChanged } = useDelayExecTask(
    500,
    React.useCallback(
      (info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => {
        const list = info.viewableItems.map((v) => {
          return v.item as ItemT;
        });
        onVisibleItems?.(list);
      },
      [onVisibleItems]
    )
  );

  const setOnSearch = React.useCallback(
    (onSearch: (keyword: string) => void) => {
      onSearchRef.current = onSearch;
    },
    []
  );

  const { delayExecTask: deferSearch } = useDelayExecTask(
    500,
    React.useCallback((keyword: string) => {
      onSearchRef.current?.(keyword);
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      propsOnRefresh?.();
      setRefreshing(false);
    }, 1000);
  }, [propsOnRefresh]);
  const onMore = React.useCallback(() => {
    propsOnLoadMore?.();
  }, [propsOnLoadMore]);

  useLifecycle(
    React.useCallback(async (state: any) => {
      if (state === 'load') {
        onInit?.();
      } else if (state === 'unload') {
        onUnInit?.();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  return {
    listState,
    setListState,
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
    refreshing: enableRefresh === true ? refreshing : undefined,
    viewabilityConfig:
      isVisibleUpdate === true ? viewabilityConfigRef.current : undefined,
    onViewableItemsChanged:
      isVisibleUpdate === true ? onViewableItemsChanged : undefined,
    deferSearch,
    setOnSearch,
  };
}
export function useFlatList<ItemT>(
  props: Omit<UseListBasicProps<ItemT>, 'listType'>
) {
  const basics = useListBasic({ ...props, listType: 'FlatList' });
  const dataRef = React.useRef<ItemT[]>([]);
  const [data, setData] = React.useState<ReadonlyArray<ItemT>>(dataRef.current);
  const ListItem: React.ComponentType<ItemT> = () => null;
  const ref = React.useRef<FlatListRef<ItemT>>({} as any);

  return {
    ...basics,
    dataRef,
    data,
    setData,
    ListItem,
    ref,
  };
}
export function useSectionList<
  ItemT,
  SectionT extends DefaultSectionT,
  ListIndexPropsT extends DefaultListIndexPropsT
>(props: Omit<UseListBasicProps<ItemT>, 'listType'>) {
  const basics = useListBasic({ ...props, listType: 'FlatList' });
  const sectionsRef = React.useRef<SectionListData<ItemT, SectionT>[]>([]);
  const [sections, setSection] = React.useState<
    ReadonlyArray<SectionListData<ItemT, SectionT>>
  >([]);
  const [indexTitles, setIndexTitles] = React.useState<string[]>([]);
  const ref = React.useRef<SectionListRef<ItemT, SectionT>>({} as any);
  const AlphabeticIndex: React.FC<ListIndexPropsT> = ListIndex;

  return {
    ...basics,
    sectionsRef,
    sections,
    setSection,
    indexTitles,
    setIndexTitles,
    AlphabeticIndex,
    ref,
  };
}
