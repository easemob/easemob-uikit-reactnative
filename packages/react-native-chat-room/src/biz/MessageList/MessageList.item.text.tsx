import * as React from 'react';
import { Animated } from 'react-native';

import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { PresetCalcTextWidth } from '../../ui/Text';
import type { MessageListItemProps, TextContent } from './types';

export function MessageListTextItem(props: MessageListItemProps) {
  const { content } = props;
  const { fonts } = usePaletteContext();
  const { addListener, removeListener } = useDispatchContext();
  const c = content as TextContent;
  const contentWidth = React.useRef(0);
  const unitSpaceWidth = React.useRef(3.5);
  const [space, setSpace] = React.useState('');
  const { fontFamily } = useConfigContext();
  const translateX = React.useRef(new Animated.Value(0)).current;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  React.useEffect(() => {
    const listener = (cId: string, width: number, headerWidth: number) => {
      if (props.id === cId) {
        if (width === 0 || headerWidth === 0) {
          return;
        }
        // @ts-ignore
        if (headerWidth === -translateX.__getValue()) {
          return;
        }
        if (width - headerWidth > contentWidth.current) {
          // one line
        } else {
          translateX.setValue(-headerWidth);
          const spacesString = Array(
            Math.round(headerWidth / unitSpaceWidth.current)
          )
            .fill(' ')
            .join('');
          setSpace(spacesString);
        }
      }
    };
    addListener(`_$${MessageListTextItem.name}`, listener);
    return () => {
      removeListener(`_$${MessageListTextItem.name}`, listener);
    };
  }, [addListener, c.text, props.id, removeListener, translateX]);
  return (
    <>
      <PresetCalcTextWidth
        content={' '}
        textProps={{ style: { ...fonts.body.medium, fontFamily } }}
        onWidth={(width: number) => {
          unitSpaceWidth.current = width;
        }}
      />
      <PresetCalcTextWidth
        content={c.text.trim()}
        textProps={{ style: { ...fonts.body.medium, fontFamily } }}
        onWidth={(width: number) => {
          contentWidth.current = width;
        }}
      />
      <Animated.Text
        // textType={'medium'}
        // paletteType={'body'}
        style={[
          {
            transform: [{ translateX: translateX }],
          },
          {
            ...fonts.body.medium,
            fontFamily,
            color: getColor('text'),
          },
        ]}
      >
        {space + c.text.trim()}
      </Animated.Text>
    </>
  );
}
