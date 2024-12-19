import * as React from 'react';
import { View } from 'react-native';

import { IndentedTextHeaderProps } from './types';

export function IndentedTextHeader(props: IndentedTextHeaderProps) {
  const { headerChildren, headerOnLayout, headerStyle } = props;
  return (
    <View style={headerStyle} onLayout={headerOnLayout}>
      {headerChildren}
    </View>
  );
}
