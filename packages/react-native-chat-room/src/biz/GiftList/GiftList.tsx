import * as React from 'react';
import {
  PanResponder,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import {
  gAspectRatio,
  gItemAspectRatio,
  gItemCountPerRow,
} from './GiftList.const';
import { GiftListItem, GiftListItemMemo } from './GiftList.item';
import type { GiftListModel } from './types';

export type GiftListProps = {
  /**
   * Gift list data comes from the app developer. The data should conform to the constrained format. {@link GiftListModel}
   *
   */
  gifts: GiftListModel[];
  /**
   * Callback function when a gift is selected.
   */
  onSend?: (giftId: string) => void;
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture?: (finished: boolean) => void;
  /**
   * The component to be used for rendering the gift list item.
   */
  GiftListItemComponent?: typeof GiftListItem;
};

/**
 * Gift list.
 *
 * @test {@link example/src/__dev__/test_gift_list.tsx}
 *
 * @param props {@link GiftListProps}
 * @returns JSX.Element
 */
export function GiftList(props: GiftListProps) {
  const { gifts, onSend, requestUseScrollGesture, GiftListItemComponent } =
    props;
  const { width: winWidth } = useWindowDimensions();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const unitWidth = winWidth / gItemCountPerRow;
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const isScrollingRef = React.useRef(false);

  const _GiftListItem = GiftListItemComponent ?? GiftListItemMemo;

  const onSelected = React.useCallback((giftId: string) => {
    setSelected(giftId);
  }, []);

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

  return (
    <View
      style={{
        height: gAspectRatio * winWidth,
        backgroundColor: getColor('backgroundColor'),
      }}
      {...r.panHandlers}
    >
      <ScrollView
        onMomentumScrollEnd={() => {
          if (Platform.OS !== 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
        onResponderEnd={() => {
          if (Platform.OS === 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: winWidth,
          }}
        >
          {gifts.map((gift, i) => {
            return (
              <_GiftListItem
                key={i}
                gift={gift}
                selected={selected === gift.giftId ? true : false}
                width={unitWidth * 0.99}
                height={unitWidth * gItemAspectRatio * 0.99}
                onSelected={onSelected}
                onSend={onSend}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export const GiftListMemo = React.memo(GiftList);
