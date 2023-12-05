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
  > & {
    participantCount: number;
    onCheckClicked?: ((data?: GroupParticipantModel) => void) | undefined;
  } {
  const { onClicked, testMode, groupId, participantType } = props;
  const flatListProps = useFlatList<GroupParticipantListItemProps>({
    onInit: () => init(),
  });
  const { setData, dataRef } = flatListProps;
  const [participantCount, setParticipantCount] = React.useState(0);

  const im = useChatContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      console.log('test:zuoyu:onclicked:', data);
      if (onClicked) {
        onClicked(data);
      }
      // todo: update to model
    },
    [onClicked]
  );

  const onCheckClickedCallback = React.useCallback(
    (data?: GroupParticipantModel) => {
      if (data?.checked) {
        for (let i = 0; i < dataRef.current.length; i++) {
          const item = dataRef.current[i];
          if (item) {
            if (item.id === data.id) {
              dataRef.current[i] = {
                ...item,
                data: { ...item.data, checked: !data.checked },
              };
              setData([...dataRef.current]);
              break;
            }
          }
        }
      }
    },
    [dataRef, setData]
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
                if (
                  participantType === 'common' ||
                  participantType === undefined
                ) {
                  return {
                    id: item.id,
                    data: { ...item, checked: undefined },
                  } as GroupParticipantListItemProps;
                } else {
                  return {
                    id: item.id,
                    data: item,
                  } as GroupParticipantListItemProps;
                }
              });
              setData([...dataRef.current]);
              setParticipantCount(dataRef.current.length);
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
    onCheckClicked: onCheckClickedCallback,
    participantCount: participantCount,
  };
}
