import * as React from 'react';

import type { BottomSheetMenuProps } from './BottomSheetMenu';
import type { BottomSheetMenuHeaderType } from './BottomSheetMenuHeader';

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
export function useGetProps(props: BottomSheetMenuProps) {
  const { initItems, header, headerProps } = props;
  const [_items, setItems] = React.useState(initItems ?? []);
  const [_header, setHeader] = React.useState<
    BottomSheetMenuHeaderType | undefined
  >(header);
  const [_headerProps, setHeaderProps] = React.useState(headerProps);
  const _updateItems = (items: React.ReactElement[]) => {
    setItems([...items]);
  };
  const _updateProps = (props: BottomSheetMenuProps) => {
    const { headerProps, header, initItems } = props;
    if (initItems) {
      setItems(initItems);
    }
    setHeaderProps(headerProps);
    setHeader(header);
  };
  return {
    items: _items,
    updateItems: _updateItems,
    header: _header,
    headerProps: _headerProps,
    updateProps: _updateProps,
  };
}
