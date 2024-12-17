import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { GiftIcon } from '../GiftIcon';
import { gItemButtonHeight, gItemGiftSize } from './GiftList.const';
import type { GiftListModel } from './types';

/**
 * Properties of the `GiftListItem` component.
 */
export type GiftListItemProps = {
  /**
   * The gift model.
   */
  gift: GiftListModel;
  /**
   * Whether the gift is selected.
   */
  selected: boolean;
  /**
   * The width of the gift item.
   */
  width?: number;
  /**
   * The height of the gift item.
   */
  height?: number;
  /**
   * Callback function when the gift is selected.
   */
  onSelected?: (giftId: string) => void;
  /**
   * Callback function when the gift is sent.
   */
  onSend?: (giftId: string) => void;
};

export function GiftListItem(props: GiftListItemProps) {
  const { width, height } = props;
  return (
    <View
      style={{
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <GiftListStateItem {...props} />
    </View>
  );
}

function GiftListStateItem(props: GiftListItemProps) {
  const { gift, selected, onSelected, onSend } = props;
  const { colors, lineGradient } = usePaletteContext();
  const { start, end } = lineGradient.bottomToTop;
  const { getColor, getColors } = useColors({
    borderColor: {
      light: colors.primary[6],
      dark: colors.primary[5],
    },
    backgroundColor: {
      light: colors.primary[95],
      dark: colors.primary[2],
    },
    color: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    backgroundColor2: {
      light: [colors.primary[5], 'hsla(233, 100%, 70%, 1)'],
      dark: [colors.primary[6], 'hsla(233, 100%, 70%, 1)'],
    },
    color2: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const { tr } = useI18nContext();
  return (
    <View
      style={{
        height: '80%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: selected === true ? 1 : undefined,
        borderColor: selected === true ? getColor('borderColor') : undefined,
        backgroundColor:
          selected === true ? getColor('backgroundColor') : undefined,
        overflow: 'hidden',
      }}
      onTouchEnd={() => {
        if (selected === false) {
          onSelected?.(gift.giftId);
        }
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <GiftIcon url={gift.giftIcon} size={gItemGiftSize} borderRadius={0} />
        {selected === false ? (
          <View>
            <Text
              textType={'small'}
              paletteType={'title'}
              numberOfLines={1}
              style={{
                color: getColor('t1'),
              }}
            >
              {gift.giftName}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <Icon name={'agora_dollar'} style={{ width: 14, height: 14 }} />
          <Text
            textType={'extraSmall'}
            paletteType={'label'}
            numberOfLines={1}
            style={{
              color: getColor('t2'),
            }}
          >
            {gift.giftPrice}
          </Text>
        </View>
      </View>
      {selected === true ? (
        <LinearGradient
          colors={getColors('backgroundColor2') as (string | number)[]}
          start={start}
          end={end}
          style={{
            height: gItemButtonHeight,
            // backgroundColor: getColor('backgroundColor2'),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onSend?.(gift.giftId);
            }}
          >
            <Text
              textType={'medium'}
              paletteType={'label'}
              numberOfLines={1}
              style={{
                color: getColor('color2'),
              }}
            >
              {tr('Send')}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : null}
    </View>
  );
}

export const GiftListItemMemo = React.memo(GiftListItem);
