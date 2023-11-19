import * as React from 'react';
import type {
  SectionListData,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';

import { useDelayExecTask } from '../../hook';
import { ListIndex, ListIndexProps } from '../ListIndex';
import type { ListState, UseListReturn, UseSectionListReturn } from '../types';
import type { ContactListItemProps } from './ContactList.item';
import type { ContactListProps } from './types';

export function useContactListApi2(
  props: ContactListProps
): UseSectionListReturn<
  ContactListItemProps,
  { indexTitle: string },
  ListIndexProps
> &
  UseListReturn {
  const {} = props;
  // const _sectionsRef = React.useRef<
  //   ReadonlyArray<SectionListData<ContactListItemProps, { indexTitle: string }>>
  // >([]);
  const [sections, _setSection] = React.useState<
    ReadonlyArray<SectionListData<ContactListItemProps, { indexTitle: string }>>
  >([{ indexTitle: 'Alert', data: [{ id: '1' }] }]);
  const listType = React.useRef<'FlatList' | 'SectionList'>(
    'SectionList'
  ).current;
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, _setListState] = React.useState<ListState>('normal');
  const isLoadAll = React.useRef(true).current;
  const isShowAfterLoaded = React.useRef(true).current;
  const isVisibleUpdate = React.useRef(false).current;
  const isAutoUpdate = React.useRef(false).current;
  const isEventUpdate = React.useRef(true).current;
  const enableRefresh = React.useRef(false).current;
  const enableMore = React.useRef(false).current;
  const enableAlphabeticIndex = React.useRef(true).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const ListItem: React.ComponentType<ContactListItemProps> = () => null;
  const ListItemHeader: React.ComponentType<
    SectionListData<ContactListItemProps, { indexTitle: string }>
  > = () => null;
  const AlphabeticIndex: React.ComponentType<ListIndexProps> = ListIndex;

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
    prevProps: ContactListItemProps,
    nextProps: ContactListItemProps
  ) => boolean = () => true;

  return {
    sections,
    listState,
    listType,
    onRefresh: enableRefresh === true ? onRefresh : undefined,
    onMore: enableMore === true ? onMore : undefined,
    isLoadAll,
    isShowAfterLoaded,
    loadType,
    isVisibleUpdate,
    isAutoUpdate,
    isEventUpdate,
    ListItem,
    ListItemHeader,
    sort,
    AlphabeticIndex:
      enableAlphabeticIndex === true ? AlphabeticIndex : undefined,
    refreshing: enableRefresh === true ? refreshing : undefined,
    viewabilityConfig:
      isVisibleUpdate === true ? viewabilityConfigRef.current : undefined,
    onViewableItemsChanged:
      isVisibleUpdate === true ? onViewableItemsChanged : undefined,
  };
}
