import * as React from 'react';

import type { GroupParticipantModel } from '../../chat';
import { GroupParticipantList } from './GroupParticipantList';
import type { SelectSingleParticipantProps } from './types';

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
      onClickedItem={onSelectedSingle}
      {...props}
    />
  );
}
