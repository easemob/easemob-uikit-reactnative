import * as React from 'react';
import { Animated } from 'react-native';

import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IndentedTextBodyProps } from './types';

export function useIndentedTextBody(props: IndentedTextBodyProps) {
  const { content, id, numberOfLines, onTextLayout, textStyle } = props;
  const { fonts } = usePaletteContext();
  const { addListener, removeListener } = useDispatchContext();
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

  const onChangeWidth = React.useCallback(
    (cId: string, width: number, headerWidth: number) => {
      if (id === cId) {
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
          let spaceCount = Math.round(headerWidth / unitSpaceWidth.current);
          const spacesString = Array(spaceCount).fill(' ').join('');
          setSpace(spacesString);
        }
      }
    },
    [id, translateX]
  );

  React.useEffect(() => {
    const listener = (cId: string, width: number, headerWidth: number) => {
      if (id === cId) {
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
          let spaceCount = Math.round(headerWidth / unitSpaceWidth.current);
          const spacesString = Array(spaceCount).fill(' ').join('');
          setSpace(spacesString);
        }
      }
    };
    addListener(`_$IndentedText.name`, listener);
    return () => {
      removeListener(`_$IndentedText.name`, listener);
    };
  }, [addListener, content, id, removeListener, translateX]);

  return {
    fonts,
    numberOfLines,
    onTextLayout,
    textStyle,
    space,
    fontFamily,
    getColor,
    translateX,
    unitSpaceWidth,
    contentWidth,
    content,
    onChangeWidth,
  };
}
