import * as React from 'react';

import { ListSearch } from '../ListSearch';
import { useSearchGroup } from './SearchGroup.hooks';
import type { GroupSearchModel, SearchGroupProps } from './types';

export function SearchGroup(props: SearchGroupProps) {
  const { onCancel, containerStyle } = props;
  const { data, onClicked } = useSearchGroup(props);

  return (
    <ListSearch<GroupSearchModel>
      initData={data}
      onCancel={onCancel}
      containerStyle={containerStyle}
      searchType={'group-list'}
      onClicked={onClicked}
    />
  );
}
