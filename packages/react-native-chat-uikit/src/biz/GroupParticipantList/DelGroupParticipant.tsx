import * as React from 'react';

import {
  GroupParticipantModel,
  ResultCallback,
  useChatContext,
} from '../../chat';
import { GroupParticipantList } from './GroupParticipantList';
import type { GroupParticipantListProps } from './types';

/**
 * Delete Group Participant Component properties.
 */
export type DelGroupParticipantProps = Pick<
  GroupParticipantListProps,
  | 'groupId'
  | 'containerStyle'
  | 'onBack'
  | 'onClickedItem'
  | 'onError'
  | 'testMode'
> & {
  /**
   * Delete group participant result callback.
   */
  onDelResult?: ResultCallback<void>;
};

/**
 * Delete Group Participant Component.
 */
export function DelGroupParticipant(props: DelGroupParticipantProps) {
  const { groupId, onDelResult } = props;
  const im = useChatContext();
  const onDelParticipantCallback = React.useCallback(
    (data?: GroupParticipantModel[]) => {
      if (data) {
        im.removeGroupMembers({
          groupId,
          members: data.map((item) => item.memberId),
          onResult: (result) => {
            onDelResult?.(result);
          },
        });
      }
    },
    [groupId, im, onDelResult]
  );
  return (
    <GroupParticipantList
      participantType={'delete'}
      onDelParticipant={onDelParticipantCallback}
      {...props}
    />
  );
}
