import * as React from 'react';

import {
  ChatServiceListener,
  GroupModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import { gGroupListPageNumber } from '../const';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type { GroupListItemProps, UseGroupListProps } from './types';

export function useGroupList(
  props: UseGroupListProps
): UseFlatListReturn<GroupListItemProps> &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    tr: (key: string, ...args: any[]) => string;
  } {
  const { testMode, onClicked, onNoMore } = props;
  const flatListProps = useFlatList<GroupListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    onInit: () => init(),
    onMore: () => onMore(),
    onVisibleItems: (items: GroupListItemProps[]) => onVisibleItems(items),
  });
  const { setData, dataRef } = flatListProps;
  const im = useChatContext();
  const currentPageNumberRef = React.useRef(0);
  const isNoMoreRef = React.useRef(false);
  const { tr } = useI18nContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupModel | undefined) => {
      if (onClicked) {
        onClicked(data);
      }
    },
    [onClicked]
  );

  const addData = (list: GroupListItemProps[]) => {
    if (dataRef.current.length === 0) {
      dataRef.current = list;
      setData(list);
    } else {
      dataRef.current = [...dataRef.current, ...list];
      const uniqueList = dataRef.current.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.data.groupId === item.data.groupId)
      );
      dataRef.current = uniqueList;
      setData([...dataRef.current]);
    }
  };

  const updateData = (data: GroupModel) => {
    dataRef.current = dataRef.current.map((item) => {
      if (item.data.groupId === data.groupId) {
        item.data = { ...item.data, ...data };
      }
      return item;
    });
    setData([...dataRef.current]);
  };

  const requestList = (pageNum: number) => {
    if (testMode === 'only-ui') {
    } else {
      if (pageNum === 0) {
        currentPageNumberRef.current = 0;
        dataRef.current = [];
      }
      im.getPageGroups({
        pageSize: gGroupListPageNumber,
        pageNum: pageNum,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              const list = value.map((item) => {
                return {
                  id: item.groupId,
                  data: item,
                } as GroupListItemProps;
              });
              addData(list);
            }
            if (value) {
              if (value?.length < gGroupListPageNumber) {
                isNoMoreRef.current = true;
                onNoMore?.();
              } else {
                currentPageNumberRef.current = pageNum + 1;
              }
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

  const removeGroup = (groupId: string) => {
    dataRef.current = dataRef.current.filter((item) => item.id !== groupId);
    setData([...dataRef.current]);
  };
  const addGroup = (params: {
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
              setData([...dataRef.current]);
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

  const listenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (params: { groupId: string; groupName?: string }) => {
      removeGroup(params.groupId);
    },
    onDestroyed: (params: { groupId: string; groupName?: string }) => {
      removeGroup(params.groupId);
    },
    onAutoAcceptInvitation: (params: {
      groupId: string;
      inviter: string;
      inviteMessage?: string;
    }) => {
      addGroup({ ...params });
    },
    onCreateGroup: (group) => {
      addGroup({ groupId: group.groupId, inviter: '' });
    },
    onGroupInfoChanged: (group) => {
      updateData(group);
    },
    onDetailChanged: (_group) => {},
    onQuitGroup: (groupId) => {
      removeGroup(groupId);
    },
  });
  useChatListener(listenerRef.current);

  return {
    ...flatListProps,
    onMore,
    onClicked: onClickedCallback,
    tr,
  };
}
