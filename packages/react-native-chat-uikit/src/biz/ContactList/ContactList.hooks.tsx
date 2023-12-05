import * as React from 'react';

// import { DeviceEventEmitter } from 'react-native';
import {
  ChatServiceListener,
  ContactModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useSectionList } from '../List';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import type { ChoiceType, UseSectionListReturn } from '../types';
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
    onCreateGroup,
    contactType,
    selectedData,
    groupId,
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
  const [selectedCount, setSelectedCount] = React.useState(0);
  const choiceType = React.useRef<ChoiceType>('multiple').current;

  const im = useChatContext();

  const onSort = React.useCallback(
    (
      prevProps: ContactListItemProps,
      nextProps: ContactListItemProps
    ): number => {
      if (propsOnSort) {
        return propsOnSort(prevProps, nextProps);
      } else {
        return sortContact(prevProps, nextProps);
      }
    },
    [propsOnSort]
  );

  const onClickedCallback = React.useCallback(
    (data?: ContactModel | undefined) => {
      console.log('test:zuoyu:onClickedCallback:1', data);
      if (onClicked) {
        onClicked(data);
      }
    },
    [onClicked]
  );

  const calculateGroupCount = React.useCallback(() => {
    if (contactType !== 'create-group') {
      return;
    }
    let count = 0;
    sectionsRef.current.forEach((section) => {
      section.data.forEach((item) => {
        if (item.section.checked === true) {
          count++;
        }
      });
    });
    setSelectedCount(count);
  }, [contactType, sectionsRef]);

  const onSetData = React.useCallback(
    (list: ContactListItemProps[]) => {
      if (isSort === true) {
        list.sort(onSort);
      }
      calculateGroupCount();

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
    },
    [
      calculateGroupCount,
      isSort,
      onSort,
      sectionsRef,
      setIndexTitles,
      setSection,
    ]
  );

  const addContact = React.useCallback(
    (data: ContactModel) => {
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
        } as ContactListItemProps);
      }
      onSetData(list);
    },
    [contactType, onSetData, sectionsRef]
  );

  const removeContact = React.useCallback(
    (userId: string) => {
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
    },
    [contactType, sectionsRef, setIndexTitles, setSection]
  );

  const updateContact = React.useCallback(
    (data: ContactModel) => {
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
      if (isExisted !== undefined) {
        if (data.checked !== undefined) {
          if (contactType === 'create-group') {
            im.setContactCheckedState({
              key: contactType,
              userId: data.userId,
              checked: data.checked,
            });
          } else if (contactType === 'add-group-member') {
            if (groupId) {
              im.setContactCheckedState({
                key: groupId,
                userId: data.userId,
                checked: data.checked,
              });
            }
          }
        }

        onSetData(list);
      }
    },
    [contactType, groupId, im, onSetData, sectionsRef]
  );

  const onCheckClickedCallback = React.useCallback(
    (data?: ContactModel) => {
      console.log('test:zuoyu:onCheckClickedCallback:1', data);
      if (
        contactType !== 'create-group' &&
        contactType !== 'add-group-member'
      ) {
        return;
      }
      if (data && data.checked !== undefined) {
        if (choiceType === 'single') {
        } else if (choiceType === 'multiple') {
          const tmp = { ...data, checked: !data.checked };
          updateContact(tmp);
        }
      }
    },
    [choiceType, contactType, updateContact]
  );

  const onIndexSelected = React.useCallback(
    (index: number) => {
      sectionListRef?.current?.scrollToLocation?.({
        sectionIndex: index,
        itemIndex: 1,
      });
    },
    [sectionListRef]
  );

  const init = async (isClearState?: boolean) => {
    console.log('test:zuoyu:init:2', isClearState);
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
        } as ContactListItemProps;
      });
      onSetData(testList);
      return;
    }
    if (isAutoLoad === true) {
      if (isClearState === undefined || isClearState === true) {
        if (contactType === 'create-group') {
          im.clearContactCheckedState({ key: contactType });
        } else if (contactType === 'add-group-member') {
          if (groupId) {
            im.clearContactCheckedState({ key: groupId });
          }
        }
      }

      im.setContactOnRequestData(onRequestData);
      const s = await im.loginState();
      if (s === 'logged') {
        if (contactType === 'add-group-member') {
          im.getAllContacts({
            onResult: (result) => {
              const { isOk, value, error } = result;
              if (isOk === true) {
                if (value && groupId) {
                  im.getAllGroupMembers({
                    groupId,
                    onResult: (groupResult) => {
                      if (groupResult.isOk === true) {
                        const groupMembers = groupResult.value ?? [];
                        const list = value.map((item) => {
                          const isExisted = groupMembers.find((member) => {
                            return member.id === item.userId;
                          });
                          return {
                            id: item.userId,
                            section: {
                              ...item,
                              checked:
                                isExisted !== undefined
                                  ? true
                                  : im.getContactCheckedState({
                                      key: groupId,
                                      userId: item.userId,
                                    }) !== undefined ?? false,
                              disable: isExisted !== undefined,
                            },
                            contactType: contactType,
                          } as ContactListItemProps;
                        });
                        onSetData(list);
                      } else {
                        if (groupResult.error) {
                          im.sendError({ error: groupResult.error });
                        }
                      }
                    },
                  });
                }
              } else {
                if (error) {
                  im.sendError({ error });
                }
              }
            },
          });
        } else {
          im.getAllContacts({
            onResult: (result) => {
              const { isOk, value, error } = result;
              if (isOk === true) {
                if (value) {
                  const list = value.map((item) => {
                    return {
                      id: item.userId,
                      section:
                        contactType === 'create-group'
                          ? {
                              ...item,
                              checked:
                                im.getContactCheckedState({
                                  key: contactType,
                                  userId: item.userId,
                                }) !== undefined ?? false,
                            }
                          : item,
                      contactType: contactType,
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
                            onResult: (_result) => {
                              // todo:
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
            menuRef.current?.startHide?.(() => {
              onNewGroup?.();
            });
          },
        },
      ],
      onRequestModalClose: onRequestModalClose,
      layoutType: 'left',
      hasCancel: false,
    });
  };

  const alertRef = React.useRef<AlertRef>(null);

  useChatListener(
    React.useMemo(() => {
      return {
        onContactAdded: async (userId: string) => {
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
      } as ChatServiceListener;
    }, [addContact, im, removeContact])
  );

  // React.useEffect(() => {
  //   if (contactType !== 'create-group') {
  //     return;
  //   }
  //   const listener = (
  //     callback: (
  //       list: {
  //         convId: string;
  //         checked: boolean | undefined;
  //       }[]
  //     ) => void
  //   ) => {
  //     const list = sectionsRef.current
  //       .map((section) => {
  //         return section.data.map((item) => {
  //           return item;
  //         });
  //       })
  //       .flat()
  //       .map((item) => {
  //         return {
  //           convId: item.section.userId,
  //           checked: item.section.checked,
  //         };
  //       });
  //     callback(list);
  //   };
  //   const sub = DeviceEventEmitter.addListener(
  //     '_$request_contact_state',
  //     listener
  //   );
  //   return () => {
  //     sub.remove();
  //   };
  // }, [contactType, sectionsRef]);

  React.useEffect(() => {
    console.log('test:zuoyu:create-group:1', contactType, selectedData?.length);
    if (contactType !== 'create-group' && contactType !== 'add-group-member') {
      return;
    }
    if (selectedData && selectedData.length > 0) {
      console.log('test:zuoyu:init:1');
      init(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactType, onSetData, sectionsRef, selectedData]);

  const onCreateGroupCallback = React.useCallback(() => {
    if (contactType !== 'create-group') {
      return;
    }
    const list = sectionsRef.current
      .map((section) => {
        return section.data.map((item) => {
          return item;
        });
      })
      .flat()
      .filter((item) => {
        return item.section.checked === true;
      })
      .map((item) => {
        return item.section;
      });
    onCreateGroup?.(list);
  }, [contactType, onCreateGroup, sectionsRef]);

  return {
    ...sectionProps,
    onIndexSelected,
    onRequestModalClose,
    menuRef,
    onShowMenu,
    alertRef,
    onClicked: onClickedCallback,
    onCheckClicked: onCheckClickedCallback,
    selectedCount,
    onCreateGroup: onCreateGroupCallback,
  };
}

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
