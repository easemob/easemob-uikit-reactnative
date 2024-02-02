import * as React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { IconNameType } from '../../assets';

export type TabPageHeaderRef = {
  toLeft: (movedCount: number) => void;
  toRight: (movedCount: number) => void;
};
export type TabPageHeaderProps = {
  propRef: React.RefObject<TabPageHeaderRef>;
  onClicked?: (index: number) => void;
  titles: {
    title?: string;
    icon?: IconNameType | number;
  }[];
  width?: number;
  indicatorStyle?: StyleProp<ViewStyle>;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
  content?: {
    style?: StyleProp<TextStyle>;
    /**
     * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
     */
    containerStyle?: StyleProp<ViewStyle>;
  };
  initIndex?: number;
};

export type TabPageBodyItemProps = ScrollViewProps;
export function TabPageBodyItem(props: TabPageBodyItemProps) {
  const { style, children, ...others } = props;
  return (
    <ScrollView style={[style]} {...others}>
      {children}
    </ScrollView>
  );
}

export type TabPageBodyRef = {
  scrollTo: (index: number, animated?: boolean) => void;
};
export type TabPageBodyProps = Omit<
  ScrollViewProps,
  | 'pagingEnabled'
  | 'showsHorizontalScrollIndicator'
  | 'bounces'
  | 'horizontal'
  | 'children'
> & {
  propsRef: React.RefObject<TabPageBodyRef>;
  children: React.ReactNode[];
  height?: number;
  width?: number;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
  initIndex?: number;
  onCurrentIndex?: (currentIndex: number) => void;
};

export type BodyChildrenProps<Props extends {}> = Props & {
  /**
   * Provided internally, users only need to use it.
   */
  index: number;
  /**
   * Provided internally, users only need to use it.
   */
  currentIndex: number;
};

export type TabPageBodyTRef = TabPageBodyRef;
export type TabPageBodyTProps<BodyProps extends {} = {}> = Omit<
  ScrollViewProps,
  | 'pagingEnabled'
  | 'showsHorizontalScrollIndicator'
  | 'bounces'
  | 'horizontal'
  | 'children'
> & {
  propsRef: React.RefObject<TabPageBodyTRef>;
  childrenCount: number;
  RenderChildren: React.ComponentType<BodyChildrenProps<BodyProps>>;
  RenderChildrenProps: BodyChildrenProps<BodyProps>;
  height?: number;
  width?: number;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
  initIndex?: number;
  onCurrentIndex?: (currentIndex: number) => void;
  scrollEnabled?: boolean;
};

export type TabPageBodyLISTRef = TabPageBodyRef;
export type TabPageBodyLISTProps<BodyProps extends {} = {}> = Omit<
  ScrollViewProps,
  | 'pagingEnabled'
  | 'showsHorizontalScrollIndicator'
  | 'bounces'
  | 'horizontal'
  | 'children'
> & {
  propsRef: React.RefObject<TabPageBodyLISTRef>;
  childrenCount: number;
  RenderChildren: React.ComponentType<BodyChildrenProps<BodyProps>>[];
  RenderChildrenProps: BodyChildrenProps<BodyProps>;
  height?: number;
  width?: number;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
  initIndex?: number;
  onCurrentIndex?: (currentIndex: number) => void;
  enableCurrentIndex?: boolean;
  scrollEnabled?: boolean;
};

export type TabPageBodyLISTContentProps<BodyProps extends {} = {}> = {
  RenderChildren: React.ComponentType<BodyChildrenProps<BodyProps>>[];
  RenderChildrenProps: BodyChildrenProps<BodyProps>;
  width?: number;
  currentIndex?: number;
};
