import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';
import { Icon } from '../Image';

export type TriangleViewProps = {
  rotate?: string;
  side1?: number;
  side2?: number;
  side3?: number;
};
export function TriangleView(props: TriangleViewProps) {
  if (Platform.OS === 'android') {
    return <TriangleViewAndroid {...props} />;
  } else if (Platform.OS === 'ios') {
    return <TriangleViewIos {...props} />;
  }
  return <TriangleViewIos {...props} />;
}

export function TriangleViewIos(props: TriangleViewProps) {
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

export function TriangleViewAndroid(props: TriangleViewProps) {
  const { rotate = '0deg', side3 = 8 } = props;
  const { getColor } = useColors();
  return (
    <Icon
      name={'message_arrow'}
      style={{
        tintColor: getColor('bg'),
        width: side3,
        height: 5,
        transform: [{ rotate: rotate }],
      }}
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
