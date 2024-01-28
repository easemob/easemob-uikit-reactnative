import * as React from 'react';
import { SectionListData, View } from 'react-native';
import {
  ChatConversationType,
  ChatMultiDeviceEvent,
} from 'react-native-chat-sdk';

// import { DeviceEventEmitter } from 'react-native';
import {
  ChatServiceListener,
  ContactModel,
  NewRequestModel,
  UIContactListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { RequestListListener } from '../../chat/requestList.types';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { SectionListRef } from '../../ui/SectionList';
import { Text } from '../../ui/Text';
import { containsChinese, getPinyinFirsLetter } from '../../utils';
import { Badges } from '../Badges';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useContactListMoreActions } from '../hooks/useContactListMoreActions';
import { useSectionList } from '../List';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import type { ChoiceType, ListStateType } from '../types';
import { g_index_alphabet_range } from './const';
import {
  ContactItem,
  ContactListItemHeaderMemo,
  ContactListItemMemo,
} from './ContactList.item';
import type {
  ContactListItemComponentType,
  ContactListItemHeaderComponentType,
  ContactListItemProps,
  ContactListProps,
} from './types';

/**
 * Contact list hook.
 */
export function useContactList(props: ContactListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    testMode,
    // onRequestMultiData,
    onSort: propsOnSort,
    onClickedNewContact: propsOnClickedNewContact,
    onCreateGroupResultValue,
    contactType,
    selectedData,
    groupId,
    onAddGroupParticipantResult,
    ListItemRender: propsListItemRender,
    ListItemHeaderRender: propsListItemHeaderRender,
    propsRef,
    onInitialized,
    sectionListProps: propsSectionListProps,
    onStateChanged,
    onInitListItemActions: propsOnInitListItemActions,
    onClickedNewRequest,
    onClickedGroupList,
  } = props;
  const sectionListProps = useSectionList<
    ContactListItemProps,
    IndexModel,
    ListIndexProps
  >({
    // onInit: () => init({ onFinished: onInitialized }),
  });
  const {
    isSort,
    setIndexTitles,
    setSection,
    sectionsRef,
    ref: sectionListRef,
    isAutoLoad,
    setListState,
  } = sectionListProps;
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
  const ListItemRenderRef = React.useRef<ContactListItemComponentType>(
    propsListItemRender ?? ContactListItemMemo
  );
  const ListItemHeaderRenderRef =
    React.useRef<ContactListItemHeaderComponentType>(
      propsListItemHeaderRender ?? ContactListItemHeaderMemo
    );
  const { onShowContactListMoreActions } = useContactListMoreActions({
    menuRef,
    alertRef,
  });

  const updateState = React.useCallback(
    (state: ListStateType) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

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
      onClickedItem?.(data);
    },
    [onClickedItem]
  );

  const onLongPressCallback = React.useCallback(
    (data?: ContactModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const getFirst = React.useCallback((str?: string) => {
    let ret: string | undefined;
    if (str && str.length > 0) {
      const first = str[0]!.toLocaleUpperCase();
      ret = first;
      if (containsChinese(first)) {
        ret = getPinyinFirsLetter(first).at(0)?.toLocaleUpperCase();
      }
    }
    return ret;
  }, []);

  const removeDuplicateData = React.useCallback(
    (list: ContactListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.section.userId === item.section.userId)
      );
      return uniqueList;
    },
    []
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

  const onChangeGroupCount = React.useCallback(() => {
    im.fetchJoinedGroupCount({
      onResult: (result) => {
        if (result.isOk === true && result.value) {
          setGroupCount(result.value);
        }
      },
    });
  }, [im]);

  const refreshToUI = React.useCallback(
    (list: ContactListItemProps[]) => {
      if (isSort === true) {
        list.sort(onSort);
      }
      const uniqueList = removeDuplicateData(list);

      const sortList: (IndexModel & { data: ContactListItemProps[] })[] = [];
      uniqueList.forEach((item) => {
        const first = getFirst(item.section.userName?.[0]?.toLocaleUpperCase());
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

      calculateGroupCount();
      calculateAddedGroupMemberCount();

      setIndexTitles(sectionsRef.current.map((item) => item.indexTitle));
      setSection(sectionsRef.current);
    },
    [
      calculateAddedGroupMemberCount,
      calculateGroupCount,
      getFirst,
      isSort,
      onSort,
      removeDuplicateData,
      sectionsRef,
      setIndexTitles,
      setSection,
    ]
  );

  const flatList = React.useCallback(
    (sectionList: SectionListData<ContactListItemProps, IndexModel>[]) => {
      return sectionList
        .map((section) => {
          return section.data.map((item) => {
            return item;
          });
        })
        .flat();
    },
    []
  );

  const addContactToUI = React.useCallback(
    (data: ContactModel) => {
      const list = flatList(sectionsRef.current);
      list.push({
        id: data.userId,
        section: data,
      } as ContactListItemProps);
      refreshToUI(list);
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const removeContactToUI = React.useCallback(
    (userId: string) => {
      sectionsRef.current = sectionsRef.current.filter((section) => {
        section.data = section.data.filter((item) => {
          return item.section.userId !== userId;
        });
        return section.data.length > 0;
      });
      refreshToUI(flatList(sectionsRef.current));
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const updateContactToUI = React.useCallback(
    (data: ContactModel) => {
      const list = flatList(sectionsRef.current);
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
            im.setModelState({
              tag: contactType,
              id: data.userId,
              state: { checked: data.checked },
            });
          } else if (contactType === 'add-group-member') {
            if (groupId) {
              im.setModelState({
                tag: groupId,
                id: data.userId,
                state: { checked: data.checked },
              });
            }
          }
        }

        refreshToUI(list);
      }
    },
    [contactType, flatList, groupId, im, refreshToUI, sectionsRef]
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
          updateContactToUI(tmp);
        }
      }
    },
    [choiceType, contactType, updateContactToUI]
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

  const init = React.useCallback(
    async (params: { isClearState?: boolean; onFinished?: () => void }) => {
      const { isClearState, onFinished } = params;
      // im.setOnRequestData(onRequestMultiData);
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
              userName: generateRandomNames(),
              userAvatar:
                'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            },
          } as ContactListItemProps;
        });
        refreshToUI(testList);
        return;
      }
      const url = im.user(im.userId)?.avatarURL;
      if (url) {
        setAvatarUrl(url);
      }
      if (isAutoLoad === true) {
        if (isClearState === undefined || isClearState === true) {
          if (contactType === 'create-group') {
            im.clearModelState({ tag: contactType });
          } else if (contactType === 'add-group-member') {
            if (groupId) {
              im.clearModelState({ tag: groupId });
            }
          }
        }

        const s = await im.loginState();
        if (s === 'logged') {
          updateState('loading');
          if (contactType === 'add-group-member') {
            im.getAllContacts({
              onResult: async (result) => {
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
                              return member.memberId === item.userId;
                            });
                            return {
                              id: item.userId,
                              section: {
                                ...item,
                                checked:
                                  isExisted !== undefined
                                    ? true
                                    : im.getModelState({
                                        tag: groupId,
                                        id: item.userId,
                                      })?.checked ?? false,
                                disable: isExisted !== undefined,
                              },
                              contactType: contactType,
                            } as ContactListItemProps;
                          });
                          refreshToUI(list);
                          updateState('normal');
                        } else {
                          if (groupResult.error) {
                            updateState('error');
                            im.sendError({ error: groupResult.error });
                          }
                        }
                      },
                    });
                  }
                } else {
                  if (error) {
                    updateState('error');
                    im.sendError({ error });
                  }
                }
                onFinished?.();
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
                                  im.getModelState({
                                    tag: contactType,
                                    id: item.userId,
                                  })?.checked ?? false,
                              }
                            : item,
                        contactType: contactType,
                      } as ContactListItemProps;
                    });
                    refreshToUI(list);
                    updateState('normal');
                  }
                } else {
                  if (error) {
                    updateState('error');
                    im.sendError({ error });
                  }
                }
                onFinished?.();
              },
            });
          }
          onChangeGroupCount();
        } else {
          updateState('error');
        }
      }
    },
    [
      contactType,
      groupId,
      im,
      isAutoLoad,
      onChangeGroupCount,
      refreshToUI,
      testMode,
      updateState,
    ]
  );

  const contactItems = React.useCallback(
    ({ requestCount }: { requestCount: number; groupCount: number }) => {
      if (contactType !== 'contact-list') {
        return null;
      }
      const items = [
        <ContactItem
          name={tr('_uikit_contact_new_request')}
          count={<Badges count={requestCount} />}
          hasArrow={true}
          onClicked={onClickedNewRequest}
        />,
        <ContactItem
          name={tr('_uikit_contact_group_list')}
          count={
            <Text paletteType={'label'} textType={'medium'}>
              {null}
            </Text>
          }
          hasArrow={true}
          onClicked={onClickedGroupList}
        />,
      ];
      const newContactItems = propsOnInitListItemActions
        ? propsOnInitListItemActions(items)
        : items;
      return newContactItems;
    },
    [
      contactType,
      onClickedGroupList,
      onClickedNewRequest,
      propsOnInitListItemActions,
      tr,
    ]
  );

  // const onAddedContact = React.useCallback(
  //   (userId: string) => {
  //     if (contactType !== 'contact-list') {
  //       return;
  //     }
  //     im.getContact({
  //       userId,
  //       onResult: (result) => {
  //         if (result.isOk === true && result.value) {
  //           addContactToUI(result.value);
  //         }
  //       },
  //     });
  //   },
  //   [addContactToUI, contactType, im]
  // );

  useChatListener(
    React.useMemo(() => {
      return {
        onContactAdded: async (_userId: string) => {
          // onAddedContact(userId);
          init({});
        },
        onContactDeleted: async (userId: string) => {
          removeContactToUI(userId);
        },
        onConversationEvent: (
          event?: ChatMultiDeviceEvent,
          convId?: string,
          _convType?: ChatConversationType
        ) => {
          if (event === ChatMultiDeviceEvent.CONTACT_REMOVE) {
            if (convId) {
              removeContactToUI(convId);
            }
          }
        },
        onContactEvent: (event) => {
          if (
            event === ChatMultiDeviceEvent.CONTACT_ACCEPT ||
            event === ChatMultiDeviceEvent.CONTACT_REMOVE
          ) {
            init({});
          }
        },
      } as ChatServiceListener;
    }, [init, removeContactToUI])
  );

  const onCreateGroupCallback = React.useCallback(() => {
    if (contactType !== 'create-group') {
      return;
    }
    const list = flatList(sectionsRef.current)
      .filter((item) => {
        return item.section.checked === true;
      })
      .map((item) => {
        return item.section;
      });
    onCreateGroupResultValue?.(list);
  }, [contactType, flatList, onCreateGroupResultValue, sectionsRef]);

  const onClickedAddGroupParticipant = React.useCallback(() => {
    if (contactType !== 'add-group-member') {
      return;
    }
    const list = flatList(sectionsRef.current)
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
  }, [
    contactType,
    flatList,
    groupId,
    im,
    onAddGroupParticipantResult,
    sectionsRef,
  ]);

  const addContact = React.useCallback(
    (userId: string) => {
      if (contactType !== 'contact-list') {
        return;
      }
      im.addNewContact({
        userId: userId,
        reason: 'add contact',
      });
    },
    [contactType, im]
  );

  const removeContact = React.useCallback(
    (item: ContactModel) => {
      if (contactType !== 'contact-list') {
        return;
      }
      im.removeContact({
        userId: item.userId,
      });
    },
    [contactType, im]
  );

  const removeConversation = React.useCallback(
    (userId: string) => {
      im.removeConversation({ convId: userId });
    },
    [im]
  );

  const setContactRemark = React.useCallback(
    (item: ContactModel) => {
      if (item.remark) {
        im.setContactRemark({
          userId: item.userId,
          remark: item.remark,
        });
      }
    },
    [im]
  );

  const onClickedNewContact = React.useCallback(() => {
    if (propsOnClickedNewContact) {
      propsOnClickedNewContact();
    } else {
      onShowContactListMoreActions(addContact);
    }
  }, [addContact, onShowContactListMoreActions, propsOnClickedNewContact]);

  const ListHeaderComponent = React.useCallback(() => {
    const ret = contactItems({ groupCount, requestCount });
    return <View>{ret}</View>;
  }, [contactItems, groupCount, requestCount]);

  if (propsRef?.current) {
    propsRef.current.addItem = (item) => {
      addContact(item.userId);
    };
    propsRef.current.closeMenu = () => closeMenu();
    propsRef.current.deleteItem = (item) => {
      removeContact(item);
      removeConversation(item.userId);
    };
    propsRef.current.getAlertRef = () => alertRef;
    propsRef.current.getList = () => {
      return flatList(sectionsRef.current).map((item) => item.section);
    };
    propsRef.current.getMenuRef = () => menuRef;
    propsRef.current.getSectionListRef = () => {
      return sectionListRef as React.RefObject<
        SectionListRef<ContactListItemProps, IndexModel>
      >;
    };
    propsRef.current.refreshList = () => {
      refreshToUI(flatList(sectionsRef.current));
    };
    propsRef.current.reloadList = () => {
      init({ onFinished: onInitialized });
    };
    propsRef.current.showMenu = () => {
      onShowContactListMoreActions(addContact);
    };
    propsRef.current.updateItem = (item) => {
      setContactRemark(item);
    };
  }

  React.useEffect(() => {
    const listener: UIContactListListener = {
      onAddedEvent: (data) => {
        addContactToUI(data);
      },
      onDeletedEvent: (data) => {
        removeContactToUI(data.userId);
      },
      onUpdatedEvent: (data) => {
        updateContactToUI(data);
      },
      onRequestRefreshEvent: () => {
        refreshToUI(flatList(sectionsRef.current));
      },
      onRequestReloadEvent: () => {
        init({ onFinished: onInitialized });
      },
      type: UIListenerType.Contact,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [
    addContactToUI,
    flatList,
    im,
    init,
    onInitialized,
    refreshToUI,
    removeContactToUI,
    sectionsRef,
    updateContactToUI,
  ]);

  React.useEffect(() => {
    if (selectedData && selectedData.length > 0) {
      setSelectedCount(selectedData.length);
      init({ isClearState: false });
    } else {
      init({});
    }
  }, [init, selectedData]);

  React.useEffect(() => {
    const listener: RequestListListener = {
      onNewRequestListChanged: (list: NewRequestModel[]) => {
        setRequestCount(list.length);
      },
    };
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
    ...sectionListProps,
    sectionListProps: propsSectionListProps,
    propsSectionListProps,
    onIndexSelected,
    onRequestCloseMenu: closeMenu,
    onClickedNewContact,
    menuRef,
    alertRef,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressCallback,
    onCheckClicked: onCheckClickedCallback,
    selectedCount,
    onClickedCreateGroup: onCreateGroupCallback,
    selectedMemberCount,
    onClickedAddGroupParticipant,
    requestCount,
    groupCount,
    avatarUrl,
    tr,
    ListItemRender: ListItemRenderRef.current,
    ListItemHeaderRender: ListItemHeaderRenderRef.current,
    contactItems,
    ListHeaderComponent,
  };
}

const sortContact = (
  prevProps: ContactListItemProps,
  nextProps: ContactListItemProps
): number => {
  if (
    prevProps.section.userName &&
    prevProps.section.userName.length > 0 &&
    nextProps.section.userName &&
    nextProps.section.userName.length > 0
  ) {
    const prevFirstLetter = prevProps.section.userName.toLowerCase();
    const nextFirstLetter = nextProps.section.userName.toLowerCase();

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
