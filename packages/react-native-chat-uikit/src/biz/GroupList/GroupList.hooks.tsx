import * as React from 'react';

import { GroupModel, useChatContext, useChatListener } from '../../chat';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type { GroupListItemProps, UseGroupListProps } from './types';

export function useGroupList(
  props: UseGroupListProps
): UseFlatListReturn<GroupListItemProps> &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > {
  const { testMode, onClicked } = props;
  const flatListProps = useFlatList<GroupListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    onInit: () => init(),
    onMore: () => onMore(),
    onVisibleItems: (items: GroupListItemProps[]) => onVisibleItems(items),
  });
  const { setData, dataRef } = flatListProps;
  const im = useChatContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupModel | undefined) => {
      if (onClicked) {
        onClicked(data);
      }
    },
    [onClicked]
  );

  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      im.getAllGroups({
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                return {
                  id: item.groupId,
                  data: item,
                } as GroupListItemProps;
              });
              setData([...dataRef.current]);
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
  const onMore = () => {};
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

  useChatListener({
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
  });

  return {
    ...flatListProps,
    onMore,
    onClicked: onClickedCallback,
  };
}
