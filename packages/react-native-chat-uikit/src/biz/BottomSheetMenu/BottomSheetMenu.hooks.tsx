import * as React from 'react';

export function useGetItems(initItems?: React.ReactElement[]) {
  const [_items, setItems] = React.useState(initItems ?? []);
  const _updateItems = (items: React.ReactElement[]) => {
    setItems([...items]);
  };
  return {
    items: _items,
    updateItems: _updateItems,
  };
}
