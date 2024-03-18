import * as React from 'react';

import type { GroupParticipantModel } from '../../chat';
import { GroupParticipantList } from './GroupParticipantList';
import type { GroupParticipantListProps } from './types';

/**
 * Delete Group Participant Component properties.
 */
export type AVSelectGroupParticipantProps = Pick<
  GroupParticipantListProps,
  'groupId' | 'containerStyle' | 'onBack' | 'onError' | 'testMode'
> & {
  /**
   * Delete group participant result callback.
   */
  onSelectResult?: (data?: GroupParticipantModel[]) => void;
};

/**
 * Delete Group Participant Component.
 */
export function AVSelectGroupParticipant(props: AVSelectGroupParticipantProps) {
  const { onSelectResult } = props;
  const onSelectParticipantCallback = React.useCallback(
    (data?: GroupParticipantModel[]) => {
      onSelectResult?.(data);
    },
    [onSelectResult]
  );
  return (
    <GroupParticipantList
      participantType={'av-meeting'}
      onSelectParticipant={onSelectParticipantCallback}
      {...props}
    />
  );
}
