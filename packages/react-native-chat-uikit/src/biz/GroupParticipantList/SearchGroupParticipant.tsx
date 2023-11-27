import * as React from 'react';

import { ListSearch } from '../ListSearch';
import { UseSearchGroupParticipant } from './SearchGroupParticipant.hooks';
import type {
  GroupParticipantSearchModel,
  SearchGroupParticipantProps,
} from './types';

export function SearchGroupParticipant(props: SearchGroupParticipantProps) {
  const { onCancel, containerStyle } = props;
  const { data, onClicked } = UseSearchGroupParticipant(props);

  return (
    <ListSearch<GroupParticipantSearchModel>
      initData={data}
      onCancel={onCancel}
      containerStyle={containerStyle}
      searchType={'group-list'}
      onClicked={onClicked}
    />
  );
}
