import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { SlideModalRef } from '../Modal';

export type ContextMenuProps = PropsWithChildren<{
  propsRef: React.RefObject<SlideModalRef>;
  position: {
    x: number;
    y: number;
  };
  containerStyle?: StyleProp<ViewStyle> | undefined;
}>;
