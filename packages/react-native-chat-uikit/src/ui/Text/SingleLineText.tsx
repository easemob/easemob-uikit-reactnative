import * as React from 'react';

import { Text, TextProps } from './Text';

export function SingleLineText(props: TextProps) {
  const { numberOfLines, children, ...others } = props;
  return (
    <Text numberOfLines={numberOfLines ?? 1} {...others}>
      {children}
    </Text>
  );
}
