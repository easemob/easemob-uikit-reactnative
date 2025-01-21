import * as React from 'react';
import { FlatList, Platform } from 'react-native';

import { getCurTs, seqId } from '../../utils';
import {
  gGiftEffectListWidth,
  gItemHeight,
  gScrollingTimeout,
} from './GiftMessageList.const';
import type { GiftMessageListItemModel } from './GiftMessageList.item.hooks';
import type { GiftMessageListTask } from './types';

export const useAddData = (params: {
  dataRef: React.MutableRefObject<GiftMessageListItemModel[]>;
  setData: React.Dispatch<React.SetStateAction<GiftMessageListItemModel[]>>;
  ref?: React.RefObject<FlatList<GiftMessageListItemModel>>;
}) => {
  const { dataRef, setData, ref } = params;
  const preTaskTs = React.useRef(0);
  const delayedScrolling = React.useRef<NodeJS.Timeout>();
  const width = gGiftEffectListWidth;
  const height = gItemHeight;

  const scrollToEnd = () => {
    if (Platform.OS === 'ios') {
      if (delayedScrolling.current) {
        clearTimeout(delayedScrolling.current);
        delayedScrolling.current = undefined;
      }
      delayedScrolling.current = setTimeout(() => {
        delayedScrolling.current = undefined;
        ref?.current?.scrollToEnd({ animated: true });
      }, gScrollingTimeout);
    } else {
      if (delayedScrolling.current) {
        clearTimeout(delayedScrolling.current);
        delayedScrolling.current = undefined;
      }
      delayedScrolling.current = setTimeout(() => {
        delayedScrolling.current = undefined;
        ref?.current?.scrollToEnd({ animated: true });
      }, gScrollingTimeout);
    }
  };

  return {
    scrollToEnd: scrollToEnd,
    addData: (task: GiftMessageListTask) => {
      let isUseAnimation = true;
      if (preTaskTs.current === 0) {
        preTaskTs.current = getCurTs();
      } else {
        const curTaskTs = getCurTs();
        if (curTaskTs - preTaskTs.current < 250) {
          isUseAnimation = false;
        } else {
          isUseAnimation = true;
        }
        preTaskTs.current = curTaskTs;
      }

      const data = dataRef.current;
      if (data.length === 0) {
        data.push({
          id: seqId('_gf').toString(),
          height: height,
          width: width,
          idState: '1-0',
          isUseAnimation: isUseAnimation,
          gift: task.model,
        });
      } else if (data.length === 1) {
        data[0]!.isUseAnimation = isUseAnimation;
        data[0]!.idState = '2-1';
        data.push({
          id: seqId('_gf').toString(),
          height: height,
          width: width,
          idState: '1-1',
          isUseAnimation: isUseAnimation,
          gift: task.model,
        });
      } else if (data.length === 2) {
        data[0]!.idState = '3-2';
        data[0]!.isUseAnimation = isUseAnimation;
        data[1]!.idState = '2-2';
        data[1]!.isUseAnimation = isUseAnimation;
        data.push({
          id: seqId('_gf').toString(),
          height: height,
          width: width,
          idState: '1-1',
          isUseAnimation: isUseAnimation,
          gift: task.model,
        });
      } else if (data.length === 3) {
        data.shift();
        data[0]!.idState = '3-3';
        data[0]!.isUseAnimation = isUseAnimation;
        data[1]!.idState = '2-3';
        data[1]!.isUseAnimation = isUseAnimation;
        data.push({
          id: seqId('_gf').toString(),
          height: height,
          width: width,
          idState: '1-1',
          isUseAnimation: isUseAnimation,
          gift: task.model,
        });
      }

      setData([...data]);
    },
    clearData: () => {
      if (dataRef.current.length > 0) {
        if (dataRef.current.length === 3) {
          dataRef.current.shift();
        }
        if (dataRef.current.length === 2) {
          dataRef.current.shift();
          dataRef.current[0]!.idState = '2-1';
        } else {
          dataRef.current = [];
        }
        setData([...dataRef.current]);
      }
    },
  };
};
