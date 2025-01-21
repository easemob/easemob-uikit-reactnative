import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { GiftIcon } from '../GiftIcon';
import { gItemBorderRadius } from './GiftMessageList.const';
import {
  GiftMessageListItemModel,
  useAnimation,
} from './GiftMessageList.item.hooks';

export type GiftMessageListItemProps = {
  item: GiftMessageListItemModel;
};

export function GiftMessageListItem(props: GiftMessageListItemProps) {
  const { item } = props;

  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.barrage.onLight[1],
      dark: colors.barrage.onDark[1],
    },
  });

  const iHeight = React.useRef(new Animated.Value(item.height)).current;
  const iWidth = React.useRef(new Animated.Value(item.width)).current;
  const ix = React.useRef(new Animated.Value(0)).current;
  const ibr = React.useRef(new Animated.Value(gItemBorderRadius)).current;

  const sf = React.useRef(new Animated.Value(1)).current;
  const tx = React.useRef(new Animated.Value(0)).current;

  useAnimation({ item, iHeight, iWidth, ix, sf, ibr, tx });

  return (
    <Animated.View
      style={[
        styles.item,
        {
          height: iHeight,
          width: iWidth,
          backgroundColor: getColor('bg'),
          transform: [
            {
              translateY: ix,
            },
          ],
          borderRadius: ibr,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.itemContent,
          {
            transform: [{ scale: sf }, { translateX: tx }],
            width: item.width,
          },
        ]}
      >
        <View>
          <Avatar url={item.gift.avatar} size={36} borderRadius={36} />
        </View>

        <View
          style={{
            flex: 1,
            maxWidth: '80%',
          }}
        >
          <View
            style={{
              paddingHorizontal: 4,
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexGrow: 1,
            }}
          >
            <Text
              textType={'small'}
              paletteType={'label'}
              numberOfLines={1}
              style={{ color: 'white' }}
            >
              {item.gift.nickname}
            </Text>
            <Text
              textType={'extraSmall'}
              paletteType={'label'}
              style={{ color: 'white' }}
              numberOfLines={1}
            >
              {item.gift.content}
            </Text>
          </View>
        </View>

        <GiftIcon url={item.gift.giftIcon} borderRadius={0} size={40} />

        <View style={{ marginLeft: 4, marginRight: 16 }}>
          <Text style={styles.dig}>x{item.gift.giftCount ?? 1}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dig: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export const GiftMessageListItemMemo = React.memo(GiftMessageListItem);
