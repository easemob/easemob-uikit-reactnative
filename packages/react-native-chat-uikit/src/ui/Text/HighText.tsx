import * as React from 'react';
import { ColorValue, StyleProp, View, ViewStyle } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text, TextProps } from './Text';

export type HighTextProps = Omit<TextProps, 'children'> & {
  keyword: string;
  content: string;
  highColors?: ColorValue[];
  textColors?: ColorValue[];
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Highlight keywords.
 *
 * **Note** Exceeding the width is not considered.
 */
export function HighText(props: HighTextProps) {
  const { containerStyle } = props;
  const { getContent } = useHighText(props);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
        },
        containerStyle,
      ]}
    >
      {getContent()}
    </View>
  );
}

export function useHighText(props: HighTextProps) {
  const { keyword, content, style, highColors, textColors, ...others } = props;
  const list = content.split(keyword);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    high: {
      light: highColors?.[0] ?? colors.primary[5],
      dark: highColors?.[1] ?? colors.primary[6],
    },
    text: {
      light: textColors?.[0] ?? colors.neutral[1],
      dark: textColors?.[1] ?? colors.primary[98],
    },
  });
  const getContent = () => {
    return list.map((item, index) => {
      if (item.length === 0) {
        if (index !== list.length - 1) {
          return (
            <Text
              key={index}
              {...others}
              style={[style, { color: getColor('high') }]}
            >
              {keyword}
            </Text>
          );
        } else {
          return null;
        }
      } else {
        if (index === list.length - 1) {
          return (
            <Text
              key={index * 10 + 1}
              {...others}
              style={[style, { color: getColor('text') }]}
            >
              {item}
            </Text>
          );
        } else {
          return (
            <View key={index} style={{ flexDirection: 'row' }}>
              <Text
                key={index * 10 + 1}
                {...others}
                style={[style, { color: getColor('text') }]}
              >
                {item}
              </Text>
              <Text
                key={index * 10 + 2}
                {...others}
                style={[style, { color: getColor('high') }]}
              >
                {keyword}
              </Text>
            </View>
          );
        }
      }
    });
  };
  return {
    getContent,
  };
}
