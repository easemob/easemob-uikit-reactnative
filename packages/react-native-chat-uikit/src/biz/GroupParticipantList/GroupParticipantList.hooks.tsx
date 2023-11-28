import * as React from 'react';

import { GroupParticipantModel, useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type {
  GroupParticipantListItemProps,
  UseGroupParticipantListProps,
} from './types';

export function useGroupParticipantList(
  props: UseGroupParticipantListProps
): UseFlatListReturn<GroupParticipantListItemProps> &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > {
  const { onClicked, testMode, groupId } = props;
  const flatListProps = useFlatList<GroupParticipantListItemProps>({
    onInit: () => init(),
  });
  const { setData, dataRef } = flatListProps;

  const im = useChatContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      if (onClicked) {
        onClicked(data);
      }
    },
    [onClicked]
  );

  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      im.getAllGroupMembers({
        groupId: groupId,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                return {
                  id: item.id,
                  data: item,
                } as GroupParticipantListItemProps;
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

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
  };
}
