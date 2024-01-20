import * as React from 'react';
import { ChatMultiDeviceEvent } from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  GroupModel,
  UIGroupListListener,
  UIListenerType,
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
import type { ListStateType } from '../types';
import { GroupListItemMemo } from './GroupList.item';
import type {
  GroupListItemComponentType,
  GroupListItemProps,
  GroupListProps,
} from './types';

export function useGroupList(props: GroupListProps) {
  const {
    testMode,
    onClickedItem,
    onLongPressedItem,
    onNoMore,
    ListItemRender: propsListItemRender,
    onStateChanged,
    propsRef,
    flatListProps: propsFlatListProps,
    // onRequestGroupData,
  } = props;
  const flatListProps = useFlatList<GroupListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    // onInit: () => init(),
    // onMore: () => onMore(),
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
  const [groupCount, setGroupCount] = React.useState(0);

  const updateState = React.useCallback(
    (state: ListStateType) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

  const onClickedCallback = React.useCallback(
    (data?: GroupModel | undefined) => {
      onClickedItem?.(data);
    },
    [onClickedItem]
  );

  const onLongPressCallback = React.useCallback(
    (data?: GroupModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const removeDuplicateData = React.useCallback(
    (list: GroupListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.data.groupId === item.data.groupId)
      );
      return uniqueList;
    },
    []
  );

  const refreshToUI = React.useCallback(
    (list: GroupListItemProps[]) => {
      dataRef.current = removeDuplicateData(list);
      setData([...dataRef.current]);
    },
    [dataRef, removeDuplicateData, setData]
  );

  const addGroupToUI = React.useCallback(
    (list: GroupModel[], pos: 'before' | 'after') => {
      const propsList = list.map((v) => {
        return {
          id: v.groupId,
          data: v,
        } as GroupListItemProps;
      });
      if (pos === 'before') {
        dataRef.current = [...propsList, ...dataRef.current];
      } else {
        dataRef.current = [...dataRef.current, ...propsList];
      }
      refreshToUI(dataRef.current);
      setGroupCount(dataRef.current.length);
    },
    [dataRef, refreshToUI]
  );

  const updateGroupToUI = React.useCallback(
    (data: GroupModel) => {
      dataRef.current = dataRef.current.map((item) => {
        if (item.data.groupId === data.groupId) {
          item.data = { ...item.data, ...data };
        }
        return item;
      });
      refreshToUI(dataRef.current);
    },
    [dataRef, refreshToUI]
  );

  const removeGroupToUI = React.useCallback(
    (groupId: string) => {
      dataRef.current = dataRef.current.filter((item) => item.id !== groupId);
      refreshToUI(dataRef.current);
      setGroupCount(dataRef.current.length);
    },
    [dataRef, refreshToUI]
  );

  const requestList = React.useCallback(
    (pageNum: number) => {
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
                isNoMoreRef.current = false;
              }

              if (value) {
                addGroupToUI(value, 'after');

                if (value?.length < gGroupListPageNumber) {
                  isNoMoreRef.current = true;
                  onNoMore?.();
                } else {
                  currentPageNumberRef.current = pageNum + 1;
                }
              }

              updateState('normal');
            } else {
              if (error) {
                im.sendError({ error });
              }
            }
          },
        });
      }
    },
    [addGroupToUI, dataRef, im, onNoMore, testMode, updateState]
  );

  const init = React.useCallback(() => {
    // im.setGroupParticipantOnRequestData(onRequestGroupData);
    requestList(0);
  }, [requestList]);

  const onMore = React.useCallback(() => {
    if (isNoMoreRef.current === true) {
      return;
    }
    requestList(currentPageNumberRef.current);
  }, [requestList]);

  const onVisibleItems = (_items: GroupListItemProps[]) => {};

  const onAddedGroup = React.useCallback(
    (params: { groupId: string; inviter: string; inviteMessage?: string }) => {
      const isExisted = dataRef.current.find(
        (item) => item.id === params.groupId
      );
      if (isExisted === undefined) {
        im.getGroupInfo({
          groupId: params.groupId,
          onResult: (result) => {
            const { isOk, value, error } = result;
            if (isOk === true && value) {
              addGroupToUI([value], 'before');
            } else {
              if (error) {
                im.sendError({ error });
              }
            }
          },
        });
      }
    },
    [addGroupToUI, dataRef, im]
  );

  const updateGroupName = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.groupName !== item.groupName && item.groupName) {
      im.setGroupName({
        groupId: item.groupId,
        groupNewName: item.groupName,
      });
    }
  };

  const updateGroupDescription = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.description !== item.description && item.description) {
      im.setGroupDescription({
        groupId: item.groupId,
        groupDescription: item.description,
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
      });
    }
  };

  const updateGroupOwner = (item: GroupModel) => {
    const data = dataRef.current.find((t) => t.id === item.groupId)?.data;
    if (data && data.owner !== item.owner && item.owner) {
      im.changeGroupOwner({
        groupId: item.groupId,
        newOwnerId: item.owner,
      });
    }
  };

  if (propsRef?.current) {
    propsRef.current.deleteItem = (item) => {
      if (item.owner === im.userId) {
        im.destroyGroup({
          groupId: item.groupId,
        });
      } else {
        im.quitGroup({
          groupId: item.groupId,
        });
      }
    };
    propsRef.current.getAlertRef = () => alertRef;
    propsRef.current.getMenuRef = () => menuRef;
    propsRef.current.getFlatListRef = () =>
      flatListRef as React.RefObject<FlatListRef<GroupListItemProps>>;
    propsRef.current.refreshList = () => {
      refreshToUI(dataRef.current);
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

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onAddedEvent: (data) => {
        addGroupToUI([data], 'before');
      },
      onUpdatedEvent: (data) => {
        updateGroupToUI(data);
      },
      onDeletedEvent: (data) => {
        removeGroupToUI(data.groupId);
      },
      onRequestRefreshEvent: () => {
        refreshToUI(dataRef.current);
      },
      onRequestReloadEvent: () => {
        init();
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [
    addGroupToUI,
    dataRef,
    im,
    init,
    refreshToUI,
    removeGroupToUI,
    updateGroupToUI,
  ]);

  const listenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (params: { groupId: string; groupName?: string }) => {
      removeGroupToUI(params.groupId);
    },
    onDestroyed: (params: { groupId: string; groupName?: string }) => {
      removeGroupToUI(params.groupId);
    },
    onAutoAcceptInvitation: (params: {
      groupId: string;
      inviter: string;
      inviteMessage?: string;
    }) => {
      onAddedGroup({ ...params });
    },
    onDetailChanged: (group) => {
      updateGroupToUI(group);
    },
    onStateChanged: (_group) => {},
    onGroupEvent: (
      event?: ChatMultiDeviceEvent,
      target?: string,
      _usernames?: Array<string>
    ): void => {
      if (event === ChatMultiDeviceEvent.GROUP_CREATE) {
        if (target) {
          onAddedGroup({ groupId: target, inviter: '' });
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_DESTROY) {
        if (target) {
          removeGroupToUI(target);
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_JOIN) {
        if (target) {
          onAddedGroup({ groupId: target, inviter: '' });
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_LEAVE) {
        if (target) {
          removeGroupToUI(target);
        }
      } else if (event === ChatMultiDeviceEvent.GROUP_INVITE_ACCEPT) {
        if (target) {
          onAddedGroup({ groupId: target, inviter: '' });
        }
      }
    },
  });
  useChatListener(listenerRef.current);

  React.useEffect(() => {
    init();
  }, [init]);

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
    groupCount,
  };
}
