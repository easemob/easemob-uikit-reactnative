import * as React from 'react';

// import { DeviceEventEmitter } from 'react-native';
import {
  ChatServiceListener,
  ContactModel,
  NewRequestModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { RequestListListener } from '../../chat/requestList.types';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useContactListMoreActions } from '../hooks/useContactListMoreActions';
import { useSectionList } from '../List';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import type { ChoiceType, UseSectionListReturn } from '../types';
import { g_index_alphabet_range } from './const';
import type {
  ContactListItemProps,
  ContactListProps,
  UseContactListReturn,
} from './types';

export function useContactList(props: ContactListProps): UseSectionListReturn<
  ContactListItemProps,
  IndexModel,
  ListIndexProps
> &
  UseContactListReturn & {
    selectedMemberCount: number;
    onAddGroupParticipantResult?: () => void;
    requestCount: number;
    groupCount: number;
    avatarUrl: string | undefined;
    tr: (key: string, ...args: any[]) => string;
    onClickedNewContact?: () => void;
  } {
  const {
    onClicked,
    testMode,
    onRequestData,
    onSort: propsOnSort,
    onClickedNewContact: propsOnClickedNewContact,
    onCreateGroupResultValue,
    contactType,
    selectedData,
    groupId,
    onAddGroupParticipantResult,
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
  const [selectedMemberCount, setSelectedMemberCount] =
    React.useState<number>(0);
  const choiceType = React.useRef<ChoiceType>('multiple').current;
  const [requestCount, setRequestCount] = React.useState(0);
  const [groupCount, setGroupCount] = React.useState(0);
  const [avatarUrl, setAvatarUrl] = React.useState<string>();
  const { tr } = useI18nContext();
  const im = useChatContext();
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const alertRef = React.useRef<AlertRef>(null);
  const { closeMenu } = useCloseMenu({ menuRef });

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

  const calculateAddedGroupMemberCount = React.useCallback(() => {
    if (contactType !== 'add-group-member') {
      return;
    }
    let count = 0;
    sectionsRef.current.forEach((section) => {
      section.data.forEach((item) => {
        if (item.section.checked === true) {
          if (groupId) {
            const isExisted = im.getGroupMember({
              groupId: groupId,
              userId: item.section.userId,
            });
            if (isExisted === undefined) {
              count++;
            }
          }
        }
      });
    });
    setSelectedMemberCount(count);
  }, [contactType, groupId, im, sectionsRef]);

  const onSetData = React.useCallback(
    (list: ContactListItemProps[]) => {
      if (isSort === true) {
        list.sort(onSort);
      }
      calculateGroupCount();
      calculateAddedGroupMemberCount();

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
      calculateAddedGroupMemberCount,
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
    console.log('test:zuoyu:contact_list:init', contactType, isAutoLoad);
    const url = im.user(im.userId)?.avatarURL;
    if (url) {
      setAvatarUrl(url);
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
                  im.getGroupAllMembers({
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
                  console.log('test:zuoyu:list:', list);
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
        onChangeGroupCount();
      }
    }
  };

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
          removeContact(userId);
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
    if (contactType !== 'create-group' && contactType !== 'add-group-member') {
      return;
    }
    if (selectedData && selectedData.length > 0) {
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
    onCreateGroupResultValue?.(list);
  }, [contactType, onCreateGroupResultValue, sectionsRef]);

  const onAddGroupParticipantCallback = React.useCallback(() => {
    if (contactType !== 'add-group-member') {
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
        if (item.section.checked === true) {
          if (groupId) {
            const isExisted = im.getGroupMember({
              groupId: groupId,
              userId: item.section.userId,
            });
            return isExisted === undefined;
          }
        }
        return false;
      })
      .map((item) => {
        return item.section;
      });
    onAddGroupParticipantResult?.(list);
  }, [contactType, groupId, im, onAddGroupParticipantResult, sectionsRef]);

  const onChangeGroupCount = React.useCallback(() => {
    im.fetchJoinedGroupCount({
      onResult: (result) => {
        if (result.isOk === true && result.value) {
          setGroupCount(result.value);
        }
      },
    });
  }, [im]);

  const { onShowContactListMoreActions } = useContactListMoreActions({
    menuRef,
    alertRef,
  });
  const onClickedNewContact = React.useCallback(() => {
    if (propsOnClickedNewContact) {
      propsOnClickedNewContact();
    } else {
      onShowContactListMoreActions();
    }
  }, [onShowContactListMoreActions, propsOnClickedNewContact]);

  React.useEffect(() => {
    const listener = {
      onNewRequestListChanged: (list: NewRequestModel[]) => {
        setRequestCount(list.length);
      },
      onAutoAcceptInvitation: (_params: {
        groupId: string;
        inviter: string;
        inviteMessage?: string;
      }) => {
        onChangeGroupCount();
      },
      onCreateGroup: () => {
        onChangeGroupCount();
      },

      onMemberRemoved: (_params: { groupId: string; groupName?: string }) => {
        // todo: remove conversation item.
        onChangeGroupCount();
      },
      onDestroyed: (_params: { groupId: string; groupName?: string }) => {
        onChangeGroupCount();
      },
      onQuitGroup: () => {
        onChangeGroupCount();
      },
    } as RequestListListener;
    im.requestList.addListener('ContactList', listener);
    return () => {
      im.requestList.removeListener('ContactList');
    };
  }, [im.requestList, onChangeGroupCount]);

  React.useEffect(() => {
    im.requestList.getRequestList({
      onResult: (result) => {
        setRequestCount(result.value?.length ?? 0);
      },
    });
  }, [im.requestList]);

  return {
    ...sectionProps,
    onIndexSelected,
    onRequestModalClose: closeMenu,
    onClickedNewContact,
    menuRef,
    alertRef,
    onClicked: onClickedCallback,
    onCheckClicked: onCheckClickedCallback,
    selectedCount,
    onClickedCreateGroup: onCreateGroupCallback,
    selectedMemberCount,
    onAddGroupParticipantResult: onAddGroupParticipantCallback,
    requestCount,
    groupCount,
    avatarUrl,
    tr,
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
