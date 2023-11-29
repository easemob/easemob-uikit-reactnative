import * as React from 'react';

import { ContactModel, useChatContext, useChatListener } from '../../chat';
import type { AlertRef } from '../../ui/Alert';
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
  const {
    onClicked,
    testMode,
    onRequestData,
    onSort: propsOnSort,
    onNewContact,
    onNewConversation,
    onNewGroup,
    contactType,
  } = props;
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
    sectionsRef,
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
    sectionsRef.current = sortList;
    setIndexTitles(sectionsRef.current.map((item) => item.indexTitle));
    setSection(sectionsRef.current);
  };

  const addContact = (data: ContactModel) => {
    if (contactType !== 'contact-list') {
      return;
    }
    const list = sectionsRef.current
      .map((section) => {
        return section.data.map((item) => {
          return item;
        });
      })
      .flat();
    const isExisted = list.find((item) => {
      if (item.id === data.userId) {
        item.section = {
          ...item.section,
          ...data,
        };
        return true;
      }
      return false;
    });
    if (isExisted === undefined) {
      list.push({
        id: data.userId,
        section: data,
        onClicked: onClickedRef.current,
      } as ContactListItemProps);
    }
    onSetData(list);

    // const isExisted = sectionsRef.current.find((section) => {
    //   const index = section.data.findIndex((item) => {
    //     return item.section.userId === data.userId;
    //   });
    //   if (index !== -1) {
    //     section.data[index]!.section = {
    //       ...section.data[index]!.section,
    //       ...data,
    //     };
    //     return true;
    //   }
    //   return false;
    // });
    // if (isExisted === undefined) {
    //   //添加到指定位置
    //   const first = data.nickName?.[0]?.toLocaleUpperCase();
    //   const indexTitle = first
    //     ? g_index_alphabet_range.includes(first)
    //       ? first
    //       : '#'
    //     : '#';
    //   const index = sectionsRef.current.findIndex((section) => {
    //     return section.indexTitle === indexTitle;
    //   });
    //   if (index === -1) {
    //     sectionsRef.current.push({
    //       indexTitle: indexTitle,
    //       data: [
    //         {
    //           id: data.userId,
    //           section: data,
    //           onClicked: onClickedRef.current,
    //         } as ContactListItemProps,
    //       ],
    //     });
    //   } else {
    //     const dataTemp = [
    //       ...sectionsRef.current[index]!.data,
    //       {
    //         id: data.userId,
    //         section: data,
    //         onClicked: onClickedRef.current,
    //       } as ContactListItemProps,
    //     ];

    //     if (isSort === true) {
    //       dataTemp.sort(onSort);
    //     }

    //     sectionsRef.current[index]!.data = dataTemp;

    //     _setSection();
    //   }
    // } else {
    //   //更新
    // }
  };

  const removeContact = (userId: string) => {
    if (contactType !== 'contact-list') {
      return;
    }
    sectionsRef.current = sectionsRef.current.filter((section) => {
      section.data = section.data.filter((item) => {
        return item.section.userId !== userId;
      });
      return section.data.length > 0;
    });
    setIndexTitles(sectionsRef.current.map((item) => item.indexTitle));
    setSection(sectionsRef.current);
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
    if (contactType !== 'contact-list') {
      return;
    }
    menuRef.current?.startShowWithProps?.({
      initItems: [
        {
          name: 'New Conversation',
          isHigh: false,
          icon: 'bubble_fill',
          onClicked: () => {
            menuRef.current?.startHide?.();
            onNewConversation?.();
          },
        },
        {
          name: 'Add Contact',
          isHigh: false,
          icon: 'person_add_fill',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              if (onNewContact) {
                onNewContact();
              } else {
                alertRef.current?.alertWithInit?.({
                  title: 'Add Contact',
                  message: 'Add contacts by user ID.',
                  supportInput: true,
                  buttons: [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        alertRef.current?.close?.();
                      },
                    },
                    {
                      text: 'Add',
                      isPreferred: true,
                      onPress: (value) => {
                        alertRef.current?.close?.();
                        if (value) {
                          im.addNewContact({
                            useId: value.trim(),
                            reason: 'add contact',
                            onResult: (result) => {
                              // todo:
                              console.log('test:zuoyu:addNewContact:', result);
                            },
                          });
                        }
                      },
                    },
                  ],
                });
              }
            });
          },
        },
        {
          name: 'Create Group',
          isHigh: false,
          icon: 'person_double_fill',
          onClicked: () => {
            menuRef.current?.startHide?.();
            onNewGroup?.();
          },
        },
      ],
      onRequestModalClose: onRequestModalClose,
      layoutType: 'left',
      hasCancel: false,
    });
  };

  const alertRef = React.useRef<AlertRef>(null);

  useChatListener({
    onContactAdded: async (userId: string) => {
      console.log('test:zuoyu:onContactAdded', userId);
      im.getContact({
        userId,
        onResult: (result) => {
          if (result.isOk === true && result.value) {
            addContact(result.value);
          }
        },
      });
    },
    onContactDeleted: async (userId: string) => {
      im.removeContact({
        userId,
        onResult: () => {
          removeContact(userId);
        },
      });
    },
  });

  return {
    ...sectionProps,
    onIndexSelected,
    onRequestModalClose,
    menuRef,
    onShowMenu,
    alertRef,
  };
}
