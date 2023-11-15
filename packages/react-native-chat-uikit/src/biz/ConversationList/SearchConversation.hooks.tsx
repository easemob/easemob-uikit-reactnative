import * as React from 'react';

import type { SearchConversationItemProps } from './SearchConversation.item';
import type { SearchConversationProps } from './types';

export function useSearchConversationApi<DataT>(
  props: SearchConversationProps<DataT>
) {
  const {} = props;
  // const dataRef = React.useRef<ConversationListItemProps<DataT>[]>([]);
  const [data, _setData] = React.useState<SearchConversationItemProps<DataT>[]>(
    [{ id: '1' }]
  );
  const onSearch = (_key: string) => {
    _setData([]);
  };
  return {
    data,
    onSearch,
  };
}
