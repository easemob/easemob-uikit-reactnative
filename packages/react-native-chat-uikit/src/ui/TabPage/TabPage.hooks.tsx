import * as React from 'react';
import { useWindowDimensions } from 'react-native';

import type { TabPageProps, TabPageRef } from './TabPage';
import type { TabPageBodyRef, TabPageHeaderRef } from './types';

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

export function useTabPageAPI(
  props: TabPageProps,
  ref?: React.ForwardedRef<TabPageRef>
) {
  const { header, width: initWidth, initIndex = 0 } = props;
  const { HeaderProps } = header;
  const { titles: headerTitles } = HeaderProps;
  const headerRef = React.useRef<TabPageHeaderRef>({} as any);
  const bodyRef = React.useRef<TabPageBodyRef>({} as any);
  const count = headerTitles.length;
  const { width: winWidth } = useWindowDimensions();
  const width = initWidth ?? winWidth;
  const { headerStartScrolling } = useHeaderStartScrolling(
    count,
    headerRef,
    initIndex
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        changeIndex: (index: number, animated?: boolean) => {
          bodyRef.current?.scrollTo(index, animated);
          headerStartScrolling(width, width * index);
        },
      };
    },
    [headerStartScrolling, width]
  );

  return {
    headerRef,
    bodyRef,
    headerStartScrolling,
  };
}
