import type { PropsWithChildren } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import type { SlideModalRef } from '../Modal';

export type ComponentArea1 = {
  leftTop: {
    x: number;
    y: number;
  };
  rightTop: {
    x: number;
    y: number;
  };
  leftBottom: {
    x: number;
    y: number;
  };
  rightBottom: {
    x: number;
    y: number;
  };
};

export type ComponentArea2 = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ComponentArea = ComponentArea1 | ComponentArea2;

export type ContextMenuProps = PropsWithChildren<{
  propsRef: React.RefObject<SlideModalRef>;
  position: {
    x: number;
    y: number;
  };
  noCoverageArea?: ComponentArea;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  autoCalculateSize?: boolean;
  onRequestModalClose?: () => void;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  policy?: 'side' | 'center';
  padding?: number;
}>;
