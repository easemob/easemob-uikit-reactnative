import type { UseListBasicReturn } from '../types';

export type UseListCommonProps<ItemT> = {
  /**
   * Callback notification when visible items change.
   */
  onVisibleItems?: (items: ItemT[]) => void;
  onRefresh?: () => void;
  onSearch?: (keyword: string) => void;
  onLoadMore?: () => void;
  onInit?: () => void;
  onUnInit?: () => void;
};

export type UseListBasicProps<ItemT> = UseListBasicReturn<ItemT> &
  UseListCommonProps<ItemT>;
