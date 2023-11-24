import * as React from 'react';
import type { ViewabilityConfig, ViewToken } from 'react-native';

import { useChatContext } from '../../chat';
import { useDelayExecTask, useLifecycle } from '../../hook';
import type { UseSearchReturn } from '../ListSearch';
import type { ListState, UseFlatListReturn } from '../types';
import type { ContactSearchModel, UseSearchContactProps } from './types';

export function useSearchContact(
  props: UseSearchContactProps
): UseFlatListReturn<ContactSearchModel> & UseSearchReturn<ContactSearchModel> {
  const { onClicked, testMode } = props;
  const dataRef = React.useRef<ContactSearchModel[]>([]);
  const [data, setData] = React.useState<ReadonlyArray<ContactSearchModel>>([]);
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
  const ListItem: React.ComponentType<ContactSearchModel> = () => null;

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
      ...dataRef.current.filter((item) => item.nickName?.includes(key)),
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
    prevProps: ContactSearchModel,
    nextProps: ContactSearchModel
  ) => number = () => 0;

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      im.getAllContacts({
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              const list = value.map((item) => {
                console.log(
                  'test:zuoyu:getAllContacts:item',
                  item,
                  item.nickName ??
                    (item.remark.length === 0 || item.remark === undefined)
                    ? item.userId
                    : item.remark
                );
                return {
                  ...item,
                  id: item.userId,
                  name: item.nickName
                    ? item.nickName
                    : item.remark.length === 0 || item.remark === undefined
                    ? item.userId
                    : item.remark,
                } as ContactSearchModel;
              });
              console.log('test:zuoyu:getAllContacts:list', list);
              setData(list);
            }
          } else {
            console.log('test:zuoyu:getAllContacts:error', error);
            if (error) {
              im.sendError({ error });
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
