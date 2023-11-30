import * as React from 'react';

import { ListSearch } from '../ListSearch';
import { useSearchContact } from './SearchContact.hooks';
import type { ContactSearchModel, SearchContactProps } from './types';

export function SearchContact(props: SearchContactProps) {
  const { containerStyle, searchType } = props;
  const { data, onClicked, onCancel } = useSearchContact(props);

  return (
    <ListSearch<ContactSearchModel>
      initData={data}
      onCancel={onCancel}
      containerStyle={containerStyle}
      searchType={searchType}
      onClicked={onClicked}
    />
  );
}
