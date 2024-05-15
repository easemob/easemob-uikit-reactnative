import * as React from 'react';

import { ListSearch } from '../ListSearch';
import { useSearchBlock } from './SearchBlock.hooks';
import type { BlockSearchModel, SearchBlockProps } from './types';

/**
 * Search Blocks component.
 */
export function SearchBlock(props: SearchBlockProps) {
  const { containerStyle } = props;
  const { data, onClicked, onCancel } = useSearchBlock(props);

  return (
    <ListSearch<BlockSearchModel>
      {...props}
      initData={data}
      onCancel={onCancel}
      containerStyle={containerStyle}
      searchType={'block-list'}
      onClicked={onClicked}
    />
  );
}
