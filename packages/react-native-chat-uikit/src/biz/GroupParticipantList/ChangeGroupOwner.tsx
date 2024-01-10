import * as React from 'react';

import {
  GroupParticipantModel,
  ResultCallback,
  useChatContext,
} from '../../chat';
import { GroupParticipantList } from './GroupParticipantList';
import type { GroupParticipantListProps } from './types';

export type ChangeGroupOwnerProps = Pick<
  GroupParticipantListProps,
  | 'groupId'
  | 'containerStyle'
  | 'onBack'
  | 'onClickedItem'
  | 'onError'
  | 'testMode'
> & {
  onChangeResult?: ResultCallback<string>;
};
export function ChangeGroupOwner(props: ChangeGroupOwnerProps) {
  const { groupId, onChangeResult } = props;
  const im = useChatContext();
  const onChangeOwnerCallback = React.useCallback(
    (data?: GroupParticipantModel) => {
      im.getGroupInfo({
        groupId,
        onResult: (result) => {
          if (result.isOk === true && result.value) {
            if (result.value.owner !== data?.memberId && data?.memberId) {
              im.changeGroupOwner({
                groupId,
                newOwnerId: data.memberId,
                onResult: (result) => {
                  onChangeResult?.({
                    isOk: result.isOk,
                    value: data.memberId,
                    error: result.error,
                  });
                },
              });
            }
          }
        },
      });
    },
    [groupId, im, onChangeResult]
  );
  return (
    <GroupParticipantList
      participantType={'change-owner'}
      onChangeOwner={onChangeOwnerCallback}
      {...props}
    />
  );
}
