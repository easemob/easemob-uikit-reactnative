import * as React from 'react';
import { ChatMultiDeviceEvent } from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  GroupModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { FlatListRef } from '../../ui/FlatList';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { gGroupListPageNumber } from '../const';
import { useCloseMenu } from '../hooks';
import { useFlatList } from '../List';
import type { ListState } from '../types';
import { GroupListItemMemo } from './GroupList.item';
import type {
  GroupListItemComponentType,
  GroupListItemProps,
  UseGroupListProps,
} from './types';

export function useGroupList(props: UseGroupListProps) {
  const {
    testMode,
    onClicked,
    onLongPressed,
    onNoMore,
    ListItemRender: propsListItemRender,
    onStateChanged,
    propsRef,
    flatListProps: propsFlatListProps,
  } = props;
  const flatListProps = useFlatList<GroupListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    onInit: () => init(),
    onMore: () => onMore(),
    onVisibleItems: (items: GroupListItemProps[]) => onVisibleItems(items),
  });
  const { setData, dataRef, setListState, ref: flatListRef } = flatListProps;
  const im = useChatContext();
  const currentPageNumberRef = React.useRef(0);
  const alertRef = React.useRef<AlertRef>(null);
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const { closeMenu } = useCloseMenu({ menuRef });
  const isNoMoreRef = React.useRef(false);
  const { tr } = useI18nContext();
  const ListItemRenderRef = React.useRef<GroupListItemComponentType>(
    propsListItemRender ?? GroupListItemMemo
  );

  const onSetState = React.useCallback(
    (state: ListState) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

  const onClickedCallback = React.useCallback(
    (data?: GroupModel | undefined) => {
      if (onClicked) {
        onClicked(data);
      }
    },
    [onClicked]
  );

  const onLongPressCallback = React.useCallback(
    (data?: GroupModel | undefined) => {
      if (onLongPressed) {
        onLongPressed(data);
      }
    },
    [onLongPressed]
  );

  const onSetData = React.useCallback(
    (list: GroupListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.data.groupId === item.data.groupId)
      );
      dataRef.current = uniqueList;
      setData([...dataRef.current]);
    },
    [dataRef, setData]
  );

  const addDataToUI = (list: GroupListItemProps[]) => {
    if (dataRef.current.length === 0) {
      onSetData(list);
    } else {
      dataRef.current = [...dataRef.current, ...list];
      onSetData(dataRef.current);
    }
  };

  const updateDataToUI = (data: GroupModel) => {
    dataRef.current = dataRef.current.map((item) => {
      if (item.data.groupId === data.groupId) {
        item.data = { ...item.data, ...data };
      }
      return item;
    });
    onSetData(dataRef.current);
  };

  const removeDataToUI = (groupId: string) => {
    dataRef.current = dataRef.current.filter((item) => item.id !== groupId);
    onSetData(dataRef.current);
  };

  const requestList = (pageNum: number) => {
    if (testMode === 'only-ui') {
    } else {
      im.getPageGroups({
        pageSize: gGroupListPageNumber,
        pageNum: pageNum,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (pageNum === 0) {
              currentPageNumberRef.current = 0;
              dataRef.current = [];
            }
            if (value) {
              const list = value.map((item) => {
                return {
                  id: item.groupId,
                  data: item,
                } as GroupListItemProps;
              });
              addDataToUI(list);
            }
            if (value) {
              if (value?.length < gGroupListPageNumber) {
                isNoMoreRef.current = true;
                onNoMore?.();
              } else {
                currentPageNumberRef.current = pageNum + 1;
              }
            }
            onSetState('normal');
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  };

  const init = () => {
    requestList(0);
  };
  const onMore = () => {
    if (isNoMoreRef.current === true) {
      return;
    }
    requestList(currentPageNumberRef.current);
  };
  const onVisibleItems = (_items: GroupListItemProps[]) => {};

  const onAddGroup = (params: {
    groupId: string;
    inviter: string;
    inviteMessage?: string;
  }) => {
    const isExisted = dataRef.current.find(
      (item) => item.id === params.groupId
    );
    if (isExisted === undefined) {
      im.getGroupInfo({
        groupId: params.groupId,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = [
                {
                  id: value.groupId,
                  data: value,
                },
                ...dataRef.current,
              ];
              onSetData(dataRef.current);
            } else {
              // todo: ???
            }
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  };

  const updateGroupName = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.groupName !== item.groupName && item.groupName) {
      im.setGroupName({
        groupId: item.groupId,
        groupNewName: item.groupName,
        onResult: (result) => {
          if (result.isOk === true) {
            updateDataToUI({ ...data, groupName: item.groupName });
          }
        },
      });
    }
  };

  const updateGroupDescription = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.description !== item.description && item.description) {
      im.setGroupDescription({
        groupId: item.groupId,
        groupDescription: item.description,
        onResult: (result) => {
          if (result.isOk === true) {
            updateDataToUI({ ...data, description: item.description });
          }
        },
      });
    }
  };

  const updateGroupMyRemark = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.myRemark !== item.myRemark && im.userId && item.myRemark) {
      im.setGroupMyRemark({
        groupId: item.groupId,
        memberId: im.userId,
        groupMyRemark: item.myRemark,
        onResult: (result) => {
          if (result.isOk === true) {
            updateDataToUI({ ...data, myRemark: item.myRemark });
          }
        },
      });
    }
  };

  const updateGroupOwner = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.owner !== item.owner && item.owner) {
      im.changeGroupOwner({
        groupId: item.groupId,
        newOwnerId: item.owner,
        onResult: (result) => {
          if (result.isOk === true) {
            updateDataToUI({ ...data, owner: item.owner });
          }
        },
      });
    }
  };

  if (propsRef?.current) {
    propsRef.current.deleteItem = (item) => {
      im.destroyGroup({
        groupId: item.groupId,
        onResult: (result) => {
          if (result.isOk === true) {
            removeDataToUI(item.groupId);
          }
        },
      });
    };
    propsRef.current.getAlertRef = () => alertRef;
    propsRef.current.getMenuRef = () => menuRef;
    propsRef.current.getFlatListRef = () =>
      flatListRef as React.RefObject<FlatListRef<GroupListItemProps>>;
    propsRef.current.refreshList = () => {
      onSetData(dataRef.current);
    };
    propsRef.current.reloadList = () => {
      init();
    };
    propsRef.current.updateItem = (item) => {
      updateGroupDescription(item);
      updateGroupName(item);
      updateGroupMyRemark(item);
      updateGroupOwner(item);
    };
  }

  const listenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (params: { groupId: string; groupName?: string }) => {
      removeDataToUI(params.groupId);
    },
    onDestroyed: (params: { groupId: string; groupName?: string }) => {
      removeDataToUI(params.groupId);
    },
    onAutoAcceptInvitation: (params: {
      groupId: string;
      inviter: string;
      inviteMessage?: string;
    }) => {
      onAddGroup({ ...params });
    },
    onCreateGroup: (group) => {
      onAddGroup({ groupId: group.groupId, inviter: '' });
    },
    onGroupInfoChanged: (group) => {
      updateDataToUI(group);
    },
    onDetailChanged: (_group) => {},
    onQuitGroup: (groupId) => {
      removeDataToUI(groupId);
    },
    onGroupEvent: (
      event?: ChatMultiDeviceEvent,
      target?: string,
      _usernames?: Array<string>
    ): void => {
      if (event === ChatMultiDeviceEvent.GROUP_CREATE) {
        if (target) {
          onAddGroup({ groupId: target, inviter: '' });
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_DESTROY) {
        if (target) {
          removeDataToUI(target);
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_JOIN) {
        if (target) {
          onAddGroup({ groupId: target, inviter: '' });
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_LEAVE) {
        if (target) {
          removeDataToUI(target);
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_INVITE_ACCEPT) {
        if (target) {
          onAddGroup({ groupId: target, inviter: '' });
        }
      }
    },
  });
  useChatListener(listenerRef.current);

  return {
    ...flatListProps,
    onMore,
    onClicked: onClickedCallback,
    onLongPress: onLongPressCallback,
    tr,
    ListItemRender: ListItemRenderRef.current,
    alertRef,
    menuRef,
    closeMenu,
    flatListProps: propsFlatListProps,
  };
}
