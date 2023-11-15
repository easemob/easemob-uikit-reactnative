import * as React from 'react';

import { useLifecycle } from '../../hook';
import type { ListState } from '../types';
import type { ConversationListItemProps } from './ConversationList.item';
import type { ConversationListProps } from './types';

export function useConversationListApi<DataT>(
  props: ConversationListProps<DataT>
) {
  const {} = props;
  // const dataRef = React.useRef<ConversationListItemProps<DataT>[]>([]);
  const [data, _setData] = React.useState<ConversationListItemProps<DataT>[]>([
    { id: '1' },
  ]);
  const [pageState, _setPageState] = React.useState<ListState>('normal');
  const initStateRef = React.useRef(false);
  useLifecycle((state) => {
    if (state === 'load') {
      onInit();
    } else {
    }
  });
  const onInit = () => {
    if (initStateRef.current === false) {
      initStateRef.current = true;
      onRefresh();
    }
  };
  const onRefresh = () => {
    // todo: request data
    // todo: setPageState('normal')
    // todo: setPageState('error')
  };
  const onMore = () => {};
  const onData = (_data: DataT[]) => {};

  // const _addData = (_data: ConversationListItemProps<DataT>) => {};
  // const _updateData = (_data: ConversationListItemProps<DataT>) => {};
  // const _delData = (_id: string) => {};
  return {
    data,
    pageState,
    onRefresh,
    onMore,
    onData,
  };
}
