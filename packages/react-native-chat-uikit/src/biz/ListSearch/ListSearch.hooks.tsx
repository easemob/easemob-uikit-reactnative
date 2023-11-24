import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';

import { useDelayExecTask, useLifecycle } from '../../hook';
import type { ListState, UseFlatListReturn } from '../types';
import type {
  DefaultComponentModel,
  ListSearchItemProps,
  useListSearchProps,
} from './types';

export function useListSearch<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
>(
  props: useListSearchProps<ComponentModel>
): UseFlatListReturn<ListSearchItemProps<ComponentModel>> {
  const { onClicked, testMode, initData, onSearch: propsOnSearch } = props;
  const dataRef = React.useRef<ListSearchItemProps<ComponentModel>[]>([]);
  const [data, setData] = React.useState<
    ReadonlyArray<ListSearchItemProps<ComponentModel>>
  >([]);
  const listType = React.useRef<'FlatList' | 'SectionList'>('FlatList').current;
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, _setListState] = React.useState<ListState>('normal');
  const isAutoLoad = React.useRef(true).current;
  const isLocalSearch = React.useRef(true).current;
  const isSort = React.useRef(false).current;
  const isLoadAll = React.useRef(true).current;
  const isShowAfterLoaded = React.useRef(false).current;
  const isVisibleUpdate = React.useRef(false).current;
  const isAutoUpdate = React.useRef(false).current;
  const isEventUpdate = React.useRef(true).current;
  const enableRefresh = React.useRef(false).current;
  const enableMore = React.useRef(false).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const ListItem: React.ComponentType<
    ListSearchItemProps<ComponentModel>
  > = () => null;

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

  const onSearch = async (keyword: string) => {
    if (keyword === '') {
      setData([]);
    } else {
      if (propsOnSearch) {
        const data = await propsOnSearch(keyword);
        setData(
          data.map((item) => {
            return {
              id: item.id,
              data: item,
              onClicked: onClicked,
              keyword: keyword,
            } as ListSearchItemProps<ComponentModel>;
          })
        );
      } else {
        setData([
          ...dataRef.current
            .filter((item) => item.data.name?.includes(keyword))
            .map((item) => {
              return { ...item, keyword: keyword };
            }),
        ]);
      }
    }
  };
  const { delayExecTask: deferSearch } = useDelayExecTask(
    500,
    React.useCallback(
      (keyword: string) => {
        console.log('test:zuoyu:deferSearch:', keyword);
        onSearch(keyword);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [propsOnSearch]
    )
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const onMore = () => {};

  const onSort: (
    prevProps: ListSearchItemProps<ComponentModel>,
    nextProps: ListSearchItemProps<ComponentModel>
  ) => number = () => 0;

  const onClickedRef = React.useRef((data?: ComponentModel | undefined) => {
    if (data) {
      if (onClicked) {
        onClicked(data);
      }
    }
  });

  const init = async () => {
    if (isLocalSearch === false) {
      return;
    }
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      if (typeof initData === 'function') {
        const data = await initData();
        dataRef.current = data.map((item) => {
          return {
            id: item.id,
            data: item,
            onClicked: onClickedRef.current,
            keyword: '',
          } as ListSearchItemProps<ComponentModel>;
        });
        if (isShowAfterLoaded === true) {
          setData([...dataRef.current]);
        }
      } else {
        const data = initData as ReadonlyArray<ComponentModel>;
        dataRef.current = data.map((item) => {
          return {
            id: item.id,
            data: item,
            onClicked: onClickedRef.current,
            keyword: '',
          } as ListSearchItemProps<ComponentModel>;
        });
        if (isShowAfterLoaded === true) {
          setData([...dataRef.current]);
        }
      }
    }
  };
  const unInit = () => {};

  useLifecycle(
    React.useCallback(
      async (state: any) => {
        if (state === 'load') {
          init();
        } else if (state === 'unload') {
          unInit();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [initData]
    )
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
