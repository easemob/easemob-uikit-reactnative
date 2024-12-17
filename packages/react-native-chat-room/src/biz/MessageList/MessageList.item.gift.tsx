import * as React from 'react';
import { Animated, View } from 'react-native';

import { useDispatchContext } from '../../dispatch';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { PresetCalcTextWidth } from '../../ui/Text';
import { GiftIcon } from '../GiftIcon';
import { gEllipsizeWidth, gGiftIconWidth } from './MessageList.const';
import type { GiftContent, MessageListItemProps } from './types';

export function MessageListGiftItem(props: MessageListItemProps) {
  const { content } = props;
  const { fonts } = usePaletteContext();
  const contentWidth = React.useRef(0);
  const { addListener, removeListener } = useDispatchContext();
  const { colors } = usePaletteContext();
  const width = React.useRef(new Animated.Value(0)).current;
  const { getColor } = useColors({
    text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const c = content as GiftContent;
  React.useEffect(() => {
    const listener = (cId: string, lineWidth: number, headerWidth: number) => {
      if (props.id === cId) {
        if (lineWidth === 0 || headerWidth === 0) {
          return;
        }
        const w = lineWidth - headerWidth - gGiftIconWidth - gEllipsizeWidth;
        // @ts-ignore
        if (w === width.__getValue()) {
          return;
        }
        if (w > contentWidth.current) {
          // one line
          width.setValue(contentWidth.current);
        } else {
          width.setValue(w);
        }
      }
    };
    addListener(`_$${MessageListGiftItem.name}`, listener);
    return () => {
      removeListener(`_$${MessageListGiftItem.name}`, listener);
    };
  }, [addListener, c.text, props.id, removeListener, width]);
  return (
    <>
      <PresetCalcTextWidth
        content={c.text}
        textProps={{ style: fonts.body.medium }}
        onWidth={(width: number) => {
          contentWidth.current = width;
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Animated.Text
          // textType={'medium'}
          // paletteType={'body'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          // lineBreakMode={'head'}
          style={[
            {
              // @ts-ignore
              // width: width.__getValue() === 0 ? undefined : width,
              maxWidth: width,
            },
            {
              ...fonts.body.medium,
              color: getColor('text'),
            },
          ]}
        >
          {c.text}
        </Animated.Text>
        <GiftIcon url={c.gift} size={gGiftIconWidth} borderRadius={0} />
      </View>
    </>
  );
}
