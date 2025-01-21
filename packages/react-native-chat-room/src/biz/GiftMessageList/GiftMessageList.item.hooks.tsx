import * as React from 'react';
import { Animated, Platform } from 'react-native';

import {
  gAnimateDuration,
  gAnimateType,
  gItemBorderRadius,
  gItemSmallHeight,
  gItemSmallWidth,
  gScaleFactor,
} from './GiftMessageList.const';
import type { GiftMessageListItemData } from './types';

export type GiftMessageListItemModel = {
  id: string;
  height: number;
  width: number;
  isUseAnimation: boolean;
  idState:
    | '1-0' //
    | '1-1' //
    | '2-1' //
    | '2-2' //
    | '2-3' //
    | '3-2' //
    | '3-3'; //
  gift: GiftMessageListItemData;
};

export type useAnimationProps = {
  item: GiftMessageListItemModel;
  iHeight: Animated.Value;
  iWidth: Animated.Value;
  ix: Animated.Value;
  sf: Animated.Value;
  ibr: Animated.Value;
  tx: Animated.Value;
};

export function useAnimation(props: useAnimationProps) {
  const { item, iHeight, iWidth, ix, sf, ibr, tx } = props;
  React.useEffect(() => {
    const getTx = () => -(item.width - item.width * gScaleFactor) / 2 - 4;
    if (item.isUseAnimation === true) {
      if (item.idState === '1-0') {
        if (Platform.OS === 'ios') {
          ix.setValue(84);
          Animated.timing(ix, {
            toValue: 40,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }).start();
        }
      } else if (item.idState === '1-1') {
        ix.setValue(40);
        Animated.timing(ix, {
          toValue: 0,
          useNativeDriver: false,
          duration: gAnimateDuration,
          easing: gAnimateType,
        }).start();
      } else if (item.idState === '2-1' || item.idState === '2-3') {
        ix.setValue(40);
        Animated.parallel([
          Animated.timing(ix, {
            toValue: 0,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(iHeight, {
            toValue: gItemSmallHeight,
            useNativeDriver: false,
            duration: gAnimateDuration * (1 / 6),
            delay: gAnimateDuration * (5 / 6),
            easing: gAnimateType,
          }),
          Animated.timing(iWidth, {
            toValue: gItemSmallWidth,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(sf, {
            toValue: gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(ibr, {
            toValue: gItemBorderRadius * gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(tx, {
            toValue: getTx(),
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
        ]).start();
      } else if (item.idState === '2-2') {
        ix.setValue(0);
        Animated.parallel([
          Animated.timing(ix, {
            toValue: 0,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(iHeight, {
            toValue: gItemSmallHeight,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(iWidth, {
            toValue: gItemSmallWidth,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(sf, {
            toValue: gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(ibr, {
            toValue: gItemBorderRadius * gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(tx, {
            toValue: getTx(),
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
        ]).start();
      } else if (item.idState === '3-2') {
        ix.setValue(0);
        Animated.timing(ix, {
          toValue: 0,
          useNativeDriver: false,
          duration: gAnimateDuration,
          easing: gAnimateType,
        }).start();
      } else if (item.idState === '3-3') {
        ix.setValue(40);
        Animated.timing(ix, {
          toValue: 0,
          useNativeDriver: false,
          duration: gAnimateDuration,
          easing: gAnimateType,
        }).start();
      }
    } else {
      if (item.idState === '1-0') {
      } else if (item.idState === '1-1') {
      } else if (
        item.idState === '2-1' ||
        item.idState === '2-2' ||
        item.idState === '2-3'
      ) {
        iHeight.setValue(gItemSmallHeight);
        iWidth.setValue(gItemSmallWidth);
        sf.setValue(gScaleFactor);
        ibr.setValue(gItemBorderRadius * gScaleFactor);
        tx.setValue(getTx());
      } else if (item.idState === '3-2') {
      } else if (item.idState === '3-3') {
      }
    }

    return () => {
      iHeight.stopAnimation();
      ix.stopAnimation();
    };
  }, [
    iHeight,
    iWidth,
    ibr,
    item.idState,
    item.isUseAnimation,
    item.width,
    tx,
    ix,
    sf,
  ]);
}
