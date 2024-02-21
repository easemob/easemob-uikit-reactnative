import type { UseListBasicReturn } from '../types';

export type UseListCommonProps<ItemT> = {
  /**
   * Callback notification when visible items change.
   */
  onVisibleItems?: (items: ItemT[]) => void;
  /**
   * enable refresh.
   *
   * default: false
   */
  enableRefresh?: boolean;
  /**
   * enable more.
   *
   * default: true
   */
  enableMore?: boolean;
  onInit?: () => void;
  onUnInit?: () => void;
};

export type UseListBasicProps<ItemT> = UseListBasicReturn<ItemT> &
  UseListCommonProps<ItemT>;
