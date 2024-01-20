import * as React from 'react';

import { useLifecycle } from '../../hook';
import { useFlatList } from '../List/List.hooks';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type {
  DefaultComponentModel,
  ListSearchItemProps,
  UseListSearchProps,
} from './types';

export function useListSearch<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
>(
  props: UseListSearchProps<ComponentModel>
): UseFlatListReturn<ListSearchItemProps<ComponentModel>> &
  Omit<
    ListItemActions<ComponentModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > {
  const { onClicked, testMode, initData, onSearch: propsOnSearch } = props;
  const flatListProps = useFlatList<ListSearchItemProps<ComponentModel>>({
    isShowAfterLoaded: false,
    // onSearch: (keyword: string) => onSearch(keyword),
  });
  const { setData, dataRef, isAutoLoad, isShowAfterLoaded, setOnSearch } =
    flatListProps;
  const isLocalSearch = React.useRef(props.onSearch ?? true).current;
  const keywordRef = React.useRef('');

  const onSearch = React.useCallback(
    async (keyword: string) => {
      keywordRef.current = keyword;
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
    },
    [dataRef, propsOnSearch, setData]
  );

  const onClickedCallback = React.useCallback(
    (data?: ComponentModel | undefined) => {
      if (onClicked) {
        onClicked(data);
      }
    },
    [onClicked]
  );

  const init = React.useCallback(async () => {
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
            keyword: keywordRef.current,
          } as ListSearchItemProps<ComponentModel>;
        });
        if (isShowAfterLoaded === true || keywordRef.current.length > 0) {
          onSearch(keywordRef.current);
        }
      } else {
        const data = initData as ReadonlyArray<ComponentModel>;
        dataRef.current = data.map((item) => {
          return {
            id: item.id,
            data: item,
            keyword: keywordRef.current,
          } as ListSearchItemProps<ComponentModel>;
        });
        if (isShowAfterLoaded === true || keywordRef.current.length > 0) {
          onSearch(keywordRef.current);
        }
      }
    }
  }, [
    dataRef,
    initData,
    isAutoLoad,
    isLocalSearch,
    isShowAfterLoaded,
    onSearch,
    testMode,
  ]);
  const unInit = () => {};

  useLifecycle(
    React.useCallback(
      async (state: any) => {
        if (state === 'load') {
          setOnSearch(onSearch);
          init();
        } else if (state === 'unload') {
          unInit();
        }
      },
      [init, onSearch, setOnSearch]
    )
  );

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
  };
}
