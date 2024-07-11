import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';
import { Image } from '../../ui/Image';

/**
 * Blank placeholder component.
 * @returns JSX.Element
 */
export function EmptyPlaceholder() {
  const { getColor } = useColors({});
  return (
    <View style={[styles.container, { backgroundColor: getColor('bg') }]}>
      <Image
        source={require('../../assets/bg/blank.png')}
        style={{ height: 140 }}
        resizeMode={'contain'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
