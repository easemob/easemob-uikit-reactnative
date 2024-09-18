import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';

export type TriangleViewProps = {
  rotate?: string;
  side1?: number;
  side2?: number;
  side3?: number;
};
export function TriangleView(props: TriangleViewProps) {
  const { rotate = '0deg', side1 = 6.4, side2 = 6.4, side3 = 8 } = props;
  const { getColor } = useColors();
  return (
    <View
      style={[
        {
          borderLeftWidth: side1,
          borderRightWidth: side2,
          borderBottomWidth: side3,
          borderBottomColor: getColor('bg'),
          transform: [{ rotate: rotate }],
        },
        styles.triangle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
