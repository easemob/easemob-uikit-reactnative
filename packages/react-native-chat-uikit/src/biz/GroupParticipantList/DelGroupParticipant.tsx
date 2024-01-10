import * as React from 'react';

import {
  GroupParticipantModel,
  ResultCallback,
  useChatContext,
} from '../../chat';
import { GroupParticipantList } from './GroupParticipantList';
import type { GroupParticipantListProps } from './types';

export type DelGroupParticipantProps = Pick<
  GroupParticipantListProps,
  'groupId' | 'containerStyle' | 'onBack' | 'onClicked' | 'onError' | 'testMode'
> & {
  onDelResult?: ResultCallback<void>;
};
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
