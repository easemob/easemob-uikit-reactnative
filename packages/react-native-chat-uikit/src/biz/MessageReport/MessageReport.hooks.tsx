import * as React from 'react';
import { PanResponder } from 'react-native';

import type { MessageReportItemProps } from './MessageReport.item';
import type { ReportItemModel } from './types';

export function useMessageReportApi(itemData: ReportItemModel[]) {
  const dataRef = React.useRef<MessageReportItemProps[]>(
    itemData.map((v) => {
      return { data: v };
    })
  );
  const [data, setData] = React.useState<MessageReportItemProps[]>(
    dataRef.current
  );

  const _onUpdate = (clickedItem: MessageReportItemProps) => {
    let isNeedUpdate = false;
    for (const data of dataRef.current) {
      if (data.data.id === clickedItem.data.id) {
        if (clickedItem.data.checked === false) {
          data.data.checked = true;
          isNeedUpdate = true;
        }
      } else {
        data.data.checked = false;
      }
    }
    if (isNeedUpdate === true) {
      setData([...dataRef.current]);
    }
  };

  return {
    data: data,
    onUpdate: _onUpdate,
  };
}

export function useScrollGesture(
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture?: (finished: boolean) => void
) {
  const isScrollingRef = React.useRef(false);
  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
    })
  ).current;
  return {
    isScrollingRef: isScrollingRef,
    handles: r.panHandlers,
  };
}
