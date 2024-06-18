import * as React from 'react';
import type { ColorValue, StyleProp, TextStyle } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { gUrlPattern, splitStringByUrl } from '../../utils';
import { Text, TextProps } from './Text';

export type HighUrlProps = Omit<TextProps, 'children'> & {
  /**
   * A string that may contain multiple url keywords.
   */
  content: string;
  urlColors?: ColorValue[];
  textColors?: ColorValue[];
  containerStyle?: StyleProp<TextStyle>;
  urlStyle?: StyleProp<TextStyle>;
  otherStyle?: StyleProp<TextStyle>;
  numberOfLines?: number | undefined;
  onClicked?: (url: string) => void;
};

export function HighUrl(props: HighUrlProps) {
  const { containerStyle, numberOfLines } = props;
  const { getContent } = useHighUrl(props);
  return (
    <Text
      style={[
        {
          flexDirection: 'row',
        },
        containerStyle,
      ]}
      numberOfLines={numberOfLines}
    >
      {getContent()}
    </Text>
  );
}

export function useHighUrl(props: HighUrlProps) {
  const {
    content,
    style,
    urlColors,
    textColors,
    onClicked,
    urlStyle,
    otherStyle,
    ...others
  } = props;
  const list = React.useMemo(() => splitStringByUrl(content), [content]);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    high: {
      light: urlColors?.[0] ?? colors.primary[5],
      dark: urlColors?.[1] ?? colors.primary[6],
    },
    text: {
      light: textColors?.[0] ?? colors.neutral[1],
      dark: textColors?.[1] ?? colors.primary[98],
    },
  });
  const getContent = () => {
    return list.map((item, index) => {
      const r = item.match(gUrlPattern);
      // gUrlPattern.test(item) // !!! error: The two results are inconsistent.
      if (r) {
        return (
          <Text
            key={index}
            {...others}
            style={[style, urlStyle, { color: getColor('high') }]}
            onPress={() => onClicked?.(item)}
          >
            {item}
          </Text>
        );
      } else {
        return (
          <Text
            key={index}
            {...others}
            style={[style, otherStyle, { color: getColor('text') }]}
          >
            {item}
          </Text>
        );
      }
    });
  };
  return {
    getContent,
  };
}
