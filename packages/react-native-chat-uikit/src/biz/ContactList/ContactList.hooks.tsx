import * as React from 'react';

import { useLifecycle } from '../../hook';
import type { ListState } from '../types';
import type { ContactListItemProps } from './ContactList.item';
import type { ContactListProps } from './types';

export function useContactListApi<DataT>(props: ContactListProps<DataT>) {
  const {} = props;
  // const dataRef = React.useRef<ContactListItemProps<DataT>[]>([]);
  const [data, _setData] = React.useState<
    { indexTitle: string; data: ContactListItemProps<DataT>[] }[]
  >([{ indexTitle: 'Alert', data: [{ id: '1' }] }]);
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

  // const _addData = (_data: ContactListItemProps<DataT>) => {};
  // const _updateData = (_data: ContactListItemProps<DataT>) => {};
  // const _delData = (_id: string) => {};
  return {
    data,
    pageState,
    onRefresh,
    onMore,
    onData,
  };
}
