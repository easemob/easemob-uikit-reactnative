import * as React from 'react';

import { ContactModel, useChatContext } from '../../chat';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useSectionList } from '../List';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import type { UseSectionListReturn } from '../types';
import { g_index_alphabet_range } from './const';
import type {
  ContactListItemProps,
  ContactListProps,
  UseContactListReturn,
} from './types';

export function useContactList(
  props: ContactListProps
): UseSectionListReturn<ContactListItemProps, IndexModel, ListIndexProps> &
  UseContactListReturn {
  const { onClicked, testMode, onRequestData, onSort: propsOnSort } = props;
  const sectionProps = useSectionList<
    ContactListItemProps,
    IndexModel,
    ListIndexProps
  >({
    onInit: () => init(),
  });
  const {
    isSort,
    setIndexTitles,
    setSection,
    ref: sectionListRef,
    isAutoLoad,
  } = sectionProps;

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
    sectionListRef?.current?.scrollToLocation?.({
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
                onSetData(list);
              }
            } else {
              if (error) {
                im.sendError({ error });
              }
            }
          },
        });
      }
    }
  };

  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const onRequestModalClose = () => {
    menuRef.current?.startHide?.();
  };
  const onShowMenu = () => {
    menuRef.current?.startShowWithProps?.({
      initItems: [
        {
          name: 'Create New Request',
          isHigh: false,
          icon: 'bubble_fill',
          onClicked: () => {
            // todo: create new request
            menuRef.current?.startHide?.();
          },
        },
        {
          name: 'Add Contact',
          isHigh: false,
          icon: 'person_add_fill',
          onClicked: () => {
            // todo: add contact
            menuRef.current?.startHide?.();
          },
        },
        {
          name: 'Create Group',
          isHigh: false,
          icon: 'person_double_fill',
          onClicked: () => {
            // todo: create group
            menuRef.current?.startHide?.();
          },
        },
      ],
      onRequestModalClose: onRequestModalClose,
      layoutType: 'left',
      hasCancel: false,
    });
  };

  return {
    ...sectionProps,
    onIndexSelected,
    onRequestModalClose,
    menuRef,
    onShowMenu,
  };
}
