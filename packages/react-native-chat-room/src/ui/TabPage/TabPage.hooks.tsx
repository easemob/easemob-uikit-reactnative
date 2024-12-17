import * as React from 'react';

import type { TabPageHeaderRef } from './TabPageHeader';

export const calculateIndex = (params: {
  width: number;
  contentOffsetX: number;
}) => {
  const { width, contentOffsetX } = params;
  if (Number.isInteger(width) && Number.isInteger(contentOffsetX)) {
    return Math.floor(contentOffsetX / width);
  } else {
    const w = Math.round(width);
    const c = Math.round(contentOffsetX);
    return Math.round(c / w);
  }
};

export const useHeaderStartScrolling = (
  count: number,
  headerRef?: React.RefObject<TabPageHeaderRef>,
  initIndex?: number
) => {
  const currentIndex = React.useRef(initIndex ?? 0);
  return {
    headerStartScrolling: (width: number, x: number) => {
      const index = calculateIndex({
        width: width,
        contentOffsetX: x,
      });
      const current = index;
      const pre = currentIndex.current;
      const c = Math.abs(current - pre);
      currentIndex.current = current;
      if (current > pre) {
        if (current < count) {
          headerRef?.current?.toRight(c);
        }
      } else if (current < pre) {
        if (current >= 0) {
          headerRef?.current?.toLeft(c);
        }
      }
    },
  };
};
