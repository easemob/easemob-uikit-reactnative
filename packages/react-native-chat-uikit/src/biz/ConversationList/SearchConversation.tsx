import * as React from 'react';

import { ListSearch } from '../ListSearch';
import { useSearchConversation } from './SearchConversation.hooks';
import type { ConversationSearchModel, SearchConversationProps } from './types';

export function SearchConversation(props: SearchConversationProps) {
  const { onCancel, containerStyle } = props;
  const { data, onClicked } = useSearchConversation(props);

  return (
    <ListSearch<ConversationSearchModel>
      initData={data}
      onCancel={onCancel}
      containerStyle={containerStyle}
      searchType={'conv-list'}
      onClicked={onClicked}
    />
  );
}
