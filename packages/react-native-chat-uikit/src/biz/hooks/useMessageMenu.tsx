import * as React from 'react';
import { Dimensions } from 'react-native';

import { ComponentArea } from '../../ui/ContextMenu';
import {
  BizContextMenuProps,
  ContextNameMenuProps,
  InitMenuItemsType,
  MessageMenuHeaderType,
} from '../types';

export function useMessageMenu(props: BizContextMenuProps) {
  const { initItems, header, headerProps } = props;
  const [_items, setItems] = React.useState(initItems ?? []);
  const [_header, setHeader] = React.useState<
    MessageMenuHeaderType | undefined
  >(header);
  const [_headerProps, setHeaderProps] = React.useState(headerProps);
  const _updateItems = (items: React.ReactElement[]) => {
    setItems([...items]);
  };
  const _updateProps = (props: BizContextMenuProps) => {
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
export function useMessageNameMenu(props: ContextNameMenuProps) {
  const {
    initItems,
    header,
    headerProps,
    suggestedPosition,
    maxRowCount = 3,
    unitCountPerRow = 5,
    emojiListPosition = 'bottom',
    maxHeight,
    noCoverageArea,
  } = props;
  const [_items, setItems] = React.useState(initItems ?? []);
  const [_header, setHeader] = React.useState<
    MessageMenuHeaderType | undefined
  >(header);
  const [_headerProps, setHeaderProps] = React.useState(headerProps);
  const [_suggestedPosition, setSuggestedPosition] =
    React.useState(suggestedPosition);
  const [_noCoverageArea, setNoCoverageArea] =
    React.useState<ComponentArea>(noCoverageArea);
  const [_maxRowCount, setMaxRowCount] = React.useState(maxRowCount);
  const [_maxHeight, setMaxHeight] = React.useState(
    maxHeight ?? Dimensions.get('window').height / 2
  );
  const [_emojiListPosition, setEmojiListPosition] =
    React.useState(emojiListPosition);

  const calculateMaxRowCount = React.useCallback(
    (itemLength: number, unitCount: number = 5, maxRows: number = 3) => {
      const rows = Math.ceil(itemLength / unitCount);
      return rows > maxRows ? maxRows : rows;
    },
    []
  );

  const _updateItems = (items: InitMenuItemsType[]) => {
    setItems([...items]);
    setMaxRowCount(
      calculateMaxRowCount(items.length, unitCountPerRow, maxRowCount)
    );
  };
  const _updateProps = (props: ContextNameMenuProps) => {
    const {
      headerProps,
      header,
      initItems,
      maxHeight,
      maxRowCount = 3,
      unitCountPerRow = 5,
      emojiListPosition = 'bottom',
      suggestedPosition,
      noCoverageArea,
    } = props;
    if (initItems) {
      setItems([...initItems]);
    }
    setHeaderProps(headerProps);
    setHeader(header);
    setMaxHeight(maxHeight ?? Dimensions.get('window').height / 2);
    setMaxRowCount(
      calculateMaxRowCount(initItems.length, unitCountPerRow, maxRowCount)
    );
    setSuggestedPosition(suggestedPosition);
    setNoCoverageArea(noCoverageArea);
    setEmojiListPosition(emojiListPosition);
  };
  return {
    items: _items,
    updateItems: _updateItems,
    header: _header,
    headerProps: _headerProps,
    updateProps: _updateProps,
    suggestedPosition: _suggestedPosition,
    maxRowCount: _maxRowCount,
    maxHeight: _maxHeight,
    noCoverageArea: _noCoverageArea,
    emojiListPosition: _emojiListPosition,
  };
}

export function useMessageInputBarNameMenu(props: ContextNameMenuProps) {
  const {
    initItems,
    header,
    headerProps,
    suggestedPosition,
    maxRowCount = 2,
    unitCountPerRow = 4,
    maxHeight,
    noCoverageArea,
  } = props;
  const [_items, setItems] = React.useState(initItems ?? []);
  const [_header, setHeader] = React.useState<
    MessageMenuHeaderType | undefined
  >(header);
  const [_headerProps, setHeaderProps] = React.useState(headerProps);
  const [_suggestedPosition, setSuggestedPosition] =
    React.useState(suggestedPosition);
  const [_noCoverageArea, setNoCoverageArea] =
    React.useState<ComponentArea>(noCoverageArea);
  const [_maxRowCount, setMaxRowCount] = React.useState(maxRowCount);
  const [_unitCountPerRow, setUnitCountPerRow] =
    React.useState(unitCountPerRow);
  const [_maxHeight, setMaxHeight] = React.useState(
    maxHeight ?? Dimensions.get('window').height / 2
  );

  const calculateMaxRowCount = React.useCallback(
    (itemLength: number, unitCount: number = 4, maxRows: number = 2) => {
      const rows = Math.ceil(itemLength / unitCount);
      return rows > maxRows ? maxRows : rows;
    },
    []
  );

  const _updateItems = (items: InitMenuItemsType[]) => {
    setItems([...items]);
    setMaxRowCount(
      calculateMaxRowCount(items.length, unitCountPerRow, maxRowCount)
    );
  };
  const _updateProps = (props: ContextNameMenuProps) => {
    const {
      headerProps,
      header,
      initItems,
      maxHeight,
      maxRowCount = 2,
      unitCountPerRow = 4,
      suggestedPosition,
      noCoverageArea,
    } = props;
    if (initItems) {
      setItems([...initItems]);
    }
    setHeaderProps(headerProps);
    setHeader(header);
    setMaxHeight(maxHeight ?? Dimensions.get('window').height / 2);
    setMaxRowCount(
      calculateMaxRowCount(initItems.length, unitCountPerRow, maxRowCount)
    );
    setUnitCountPerRow(unitCountPerRow);
    setSuggestedPosition(suggestedPosition);
    setNoCoverageArea(noCoverageArea);
  };
  return {
    items: _items,
    updateItems: _updateItems,
    header: _header,
    headerProps: _headerProps,
    updateProps: _updateProps,
    suggestedPosition: _suggestedPosition,
    maxRowCount: _maxRowCount,
    maxHeight: _maxHeight,
    noCoverageArea: _noCoverageArea,
    unitCountPerRow: _unitCountPerRow,
  };
}
