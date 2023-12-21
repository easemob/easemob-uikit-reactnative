import * as React from 'react';

import type { GroupParticipantModel, ResultCallback } from '../../chat';
import { GroupParticipantList } from './GroupParticipantList';
import type { GroupParticipantListProps } from './types';

export type SelectSingleParticipantProps = Pick<
  GroupParticipantListProps,
  'groupId' | 'containerStyle' | 'onBack' | 'onClicked' | 'onError' | 'testMode'
> & {
  onSelectResult?: ResultCallback<GroupParticipantModel>;
};
export function SelectSingleParticipant(props: SelectSingleParticipantProps) {
  const { onSelectResult } = props;
  const onSelectedSingle = React.useCallback(
    (data?: GroupParticipantModel) => {
      onSelectResult?.({
        isOk: true,
        value: data,
        error: undefined,
      });
    },
    [onSelectResult]
  );
  return (
    <GroupParticipantList
      participantType={'mention'}
      onClicked={onSelectedSingle}
      {...props}
    />
  );
}
