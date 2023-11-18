import * as React from 'react';
import type {
  DefaultSectionT,
  ListRenderItemInfo,
  SectionListData,
  ViewToken,
} from 'react-native';

import { useDelayExecTask } from '../../hook';
import { FlatListFactory, FlatListRef } from '../../ui/FlatList';
import type { ListIndexProps } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';

export interface ListItemProps<ItemT, SectionT extends DefaultSectionT> {
  id: string;
  data?: ArrayLike<ItemT>;
  sections?: ReadonlyArray<SectionListData<ItemT, SectionT>>;
}
export interface ListItemHeaderProps {
  indexTitle: string;
}
export type ListProps<ItemT, SectionT extends DefaultSectionT> = {
  data: ArrayLike<ItemT> | ReadonlyArray<SectionListData<ItemT, SectionT>>;
  listType: 'FlatList' | 'SectionList';
  listState?: 'loading' | 'empty' | 'error' | 'normal';
  onRefresh?: () => void;
  onMore?: () => void;
  isLoadAll?: boolean;
  isShowAfterLoaded?: boolean;
  loadType?: 'once' | 'more';
  isVisibleUpdate?: boolean;
  isAutoUpdate?: boolean;
  isEventUpdate?: boolean;
  listItem?: React.ComponentType<ListItemProps<ItemT, SectionT>>;
  listItemHeader?: React.ComponentType<ListItemHeaderProps>;
  sort?: (
    prevProps: ListItemProps<ItemT, SectionT>,
    nextProps: ListItemProps<ItemT, SectionT>
  ) => boolean;
  alphabeticIndex?: React.ComponentType<ListIndexProps>;
  ref?: React.MutableRefObject<FlatListRef<ListItemProps<ItemT, SectionT>>>;
};
export function List<
  ItemT = any,
  SectionT extends DefaultSectionT = DefaultSectionT
>(props: ListProps<ItemT, SectionT>) {
  const {} = props;
  return <></>;
}

export type FlatListProps<ItemT> = {
  listState?: 'loading' | 'empty' | 'error' | 'normal';
  onRefresh?: () => void;
  onMore?: () => void;
  isLoadAll?: boolean;
  isShowAfterLoaded?: boolean;
  loadType?: 'once' | 'more';
  isVisibleUpdate?: boolean;
  isAutoUpdate?: boolean;
  isEventUpdate?: boolean;
  listItem?: React.ComponentType<ListItemProps<ItemT, any>>;
  listItemHeader?: React.ComponentType<ListItemHeaderProps>;
  sort?: (
    prevProps: ListItemProps<ItemT, any>,
    nextProps: ListItemProps<ItemT, any>
  ) => boolean;
};

export function useFlatList<
  ItemT = any,
  SectionT extends DefaultSectionT = DefaultSectionT
>(
  props: any
): ListProps<ItemT, SectionT> & {
  refreshing?: boolean;
  viewabilityConfigRef: React.MutableRefObject<any>;
  onViewableItemsChanged: (_info: {
    viewableItems: Array<ViewToken>;
    changed: Array<ViewToken>;
  }) => void;
} {
  const {} = props;
  const ref = React.useRef<FlatListRef<ListItemProps<ItemT, SectionT>>>(
    {} as any
  );
  const viewabilityConfigRef = React.useRef({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    viewablePercentThreshold: 50,
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
  return {
    ref,
    viewabilityConfigRef,
    onViewableItemsChanged,
  } as any;
}

const FlatList = FlatListFactory();

export type XXXListProps<ItemT> = {
  p: ItemT;
};
export function XXXList<ItemT = any>(props: XXXListProps<ItemT>) {
  const {} = props;
  const {
    ref,
    data,
    onRefresh,
    refreshing,
    listItem,
    onMore,
    isVisibleUpdate,
    viewabilityConfigRef,
    onViewableItemsChanged,
    listState,
  } = useFlatList<ItemT>({});

  <FlatList
    ref={ref}
    contentContainerStyle={{
      flexGrow: 1,
      // height: '100%',
      // height: 400,
      // backgroundColor: 'yellow',
    }}
    data={data}
    refreshing={onRefresh ? refreshing : undefined}
    onRefresh={onRefresh}
    renderItem={(info: ListRenderItemInfo<ListItemProps<any, any>>) => {
      const { item } = info;
      const ListItem = listItem ?? (() => null);
      return <ListItem {...item} />;
    }}
    keyExtractor={(item: ListItemProps<any, any>) => {
      return item.id;
    }}
    onEndReached={onMore}
    viewabilityConfig={
      isVisibleUpdate ? viewabilityConfigRef.current : undefined
    }
    onViewableItemsChanged={
      isVisibleUpdate ? onViewableItemsChanged : undefined
    }
    ListEmptyComponent={EmptyPlaceholder}
    ListErrorComponent={
      listState === 'error' ? (
        <ErrorPlaceholder
          onClicked={() => {
            onRefresh?.();
          }}
        />
      ) : null
    }
  />;
}
