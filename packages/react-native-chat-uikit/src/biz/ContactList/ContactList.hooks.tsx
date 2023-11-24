import * as React from 'react';
import type {
  SectionListData,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';

import { ContactModel, useChatContext } from '../../chat';
import { useDelayExecTask, useLifecycle } from '../../hook';
import type { SectionListRef } from '../../ui/SectionList';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import { ListIndex } from '../ListIndex';
import type { ListState, UseSectionListReturn } from '../types';
import { g_index_alphabet_range } from './const';
import type { ContactListItemProps, ContactListProps } from './types';

export function useContactList(
  props: ContactListProps
): UseSectionListReturn<ContactListItemProps, IndexModel, ListIndexProps> {
  const { onClicked, testMode, onRequestData, onSort: propsOnSort } = props;
  // const _sectionsRef = React.useRef<
  //   ReadonlyArray<SectionListData<ContactListItemProps, IndexModel>>
  // >([]);
  const [sections, setSection] = React.useState<
    ReadonlyArray<SectionListData<ContactListItemProps, IndexModel>>
  >([
    {
      indexTitle: 'Alert',
      data: [
        {
          id: '1',
          section: { userId: '1', remark: '1name', nickName: '1nickname' },
        },
      ],
    },
  ]);
  const [indexTitles, setIndexTitles] = React.useState<string[]>([]);
  const listType = React.useRef<'FlatList' | 'SectionList'>(
    'SectionList'
  ).current;
  const sectionListRef = React.useRef<
    SectionListRef<ContactListItemProps, IndexModel>
  >({} as any);
  const loadType = React.useRef<'once' | 'multiple'>('once').current;
  const [listState, _setListState] = React.useState<ListState>('normal');
  const isLoadAll = React.useRef(true).current;
  const isAutoLoad = React.useRef(true).current;
  const isSort = React.useRef(true).current;
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
    SectionListData<ContactListItemProps, IndexModel>
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

  const sortContact = (
    prevProps: ContactListItemProps,
    nextProps: ContactListItemProps
  ): number => {
    if (
      prevProps.section.nickName &&
      prevProps.section.nickName.length > 0 &&
      nextProps.section.nickName &&
      nextProps.section.nickName.length > 0
    ) {
      const prevFirstLetter = prevProps.section.nickName.toLowerCase();
      const nextFirstLetter = nextProps.section.nickName.toLowerCase();

      if (prevFirstLetter < nextFirstLetter) {
        return -1;
      } else if (prevFirstLetter > nextFirstLetter) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const onMore = () => {};
  const onSort = (
    prevProps: ContactListItemProps,
    nextProps: ContactListItemProps
  ): number => {
    if (propsOnSort) {
      return propsOnSort(prevProps, nextProps);
    } else {
      return sortContact(prevProps, nextProps);
    }
  };

  const im = useChatContext();

  const onClickedRef = React.useRef((data?: ContactModel | undefined) => {
    if (data) {
      if (onClicked) {
        onClicked(data);
      }
    }
  });

  const onSetData = (list: ContactListItemProps[]) => {
    if (isSort === true) {
      list.sort(onSort);
    }

    const sortList: (IndexModel & { data: ContactListItemProps[] })[] = [];
    list.forEach((item) => {
      const first = item.section.nickName?.[0]?.toLocaleUpperCase();
      const indexTitle = first
        ? g_index_alphabet_range.includes(first)
          ? first
          : '#'
        : '#';
      const index = sortList.findIndex((section) => {
        return section.indexTitle === indexTitle;
      });
      if (index === -1) {
        sortList.push({
          indexTitle: indexTitle,
          data: [item],
        });
      } else {
        sortList[index]?.data.push(item);
      }
    });
    setIndexTitles(sortList.map((item) => item.indexTitle));
    setSection(sortList);
  };

  const onIndexSelected = (index: number) => {
    sectionListRef.current?.scrollToLocation?.({
      sectionIndex: index,
      itemIndex: 1,
    });
  };

  const init = async () => {
    if (testMode === 'only-ui') {
      const names = [
        'James',
        'John',
        'Robert',
        'Michael',
        'William',
        'David',
        'Richard',
        'Joseph',
        'Thomas',
        'Charles',
        'Patricia',
        'Jennifer',
        'Linda',
        'Elizabeth',
        'Susan',
        'Jessica',
        'Sarah',
        'Karen',
        'Nancy',
        'Lisa',
      ]; // Add more names as needed

      const generateRandomNames = () => {
        const randomIndex = Math.floor(Math.random() * names.length);
        return names[randomIndex];
      };
      const array = Array.from({ length: 10 }, (_, index) => ({
        id: index.toString(),
      }));
      const testList = array.map((item) => {
        return {
          id: item.id,
          section: {
            userId: item.id,
            remark: item.id + generateRandomNames(),
            nickName: generateRandomNames(),
            avatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
          },
          onClicked: onClickedRef.current,
        } as ContactListItemProps;
      });
      onSetData(testList);
      return;
    }
    if (isAutoLoad === true) {
      im.setContactOnRequestData(onRequestData);
      const s = await im.loginState();
      if (s === 'logged') {
        im.getAllContacts({
          onResult: (result) => {
            const { isOk, value, error } = result;
            if (isOk === true) {
              if (value) {
                const list = value.map((item) => {
                  return {
                    id: item.userId,
                    section: item,
                    onClicked: onClickedRef.current,
                  } as ContactListItemProps;
                });
                console.log('test:zuoyu:getAllContacts:list', list);
                onSetData(list);
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
    ref: sectionListRef,
    sections,
    indexTitles,
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
    onSort,
    onIndexSelected,
    AlphabeticIndex:
      enableAlphabeticIndex === true ? AlphabeticIndex : undefined,
    refreshing: enableRefresh === true ? refreshing : undefined,
    viewabilityConfig:
      isVisibleUpdate === true ? viewabilityConfigRef.current : undefined,
    onViewableItemsChanged:
      isVisibleUpdate === true ? onViewableItemsChanged : undefined,
  };
}
