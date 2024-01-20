import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Top Navigation Bar Component properties.
 */
export type TopNavigationBarProps<LeftProps, RightProps> = {
  /**
   * Title component.
   */
  Title?: React.ReactElement;
  /**
   * Left component.
   */
  Left?: React.ComponentType<LeftProps> | React.ReactElement | null | undefined;
  /**
   * Left component properties.
   */
  LeftProps?: LeftProps;
  /**
   * Right component.
   */
  Right?:
    | React.ComponentType<RightProps>
    | React.ReactElement
    | null
    | undefined;
  /**
   * Right component properties.
   */
  RightProps?: RightProps;
  /**
   * Container style for the navigation bar.
   */
  containerStyle?: StyleProp<ViewStyle>;
};

export type TopNavigationBarComponentType<LeftProps, RightProps> =
  React.ComponentType<TopNavigationBarProps<LeftProps, RightProps>>;

export type TopNavigationBarElementType<LeftProps, RightProps> =
  React.ReactElement<TopNavigationBarProps<LeftProps, RightProps>>;
