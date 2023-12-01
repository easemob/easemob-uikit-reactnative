import * as React from 'react';

import { ListSearch } from '../ListSearch';
import type { GroupSearchModel, SearchGroupProps } from './types';

export function SearchGroup(props: SearchGroupProps) {
  const { onCancel, containerStyle } = props;

  return (
    <ListSearch<GroupSearchModel>
      initData={[]}
      onCancel={onCancel}
      containerStyle={containerStyle}
      searchType={'group-list'}
    />
  );
}
