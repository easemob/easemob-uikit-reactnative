import * as React from 'react';

import { GroupModel, useChatContext } from '../../chat';
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

  return {
    ...flatListProps,
    onMore,
    onClicked: onClickedCallback,
  };
}
