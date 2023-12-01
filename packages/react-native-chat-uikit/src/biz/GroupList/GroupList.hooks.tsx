import * as React from 'react';

import { GroupModel, useChatContext, useChatListener } from '../../chat';
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
  > {
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
      setData([...uniqueList]);
    }
  };

  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      console.log(
        'test:zuoyu:creategroup:',
        gGroupListPageNumber,
        currentPageNumberRef.current
      );
      im.getPageGroups({
        pageSize: gGroupListPageNumber,
        pageNum: currentPageNumberRef.current,
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
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  };
  const onMore = () => {
    if (isNoMoreRef.current === true) {
      return;
    }
    im.getPageGroups({
      pageSize: gGroupListPageNumber,
      pageNum: currentPageNumberRef.current + 1,
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
              ++currentPageNumberRef.current;
            }
          }
        } else {
          if (error) {
            im.sendError({ error });
          }
        }
      },
    });
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
