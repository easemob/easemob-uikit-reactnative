import type { StyleProp, ViewStyle } from 'react-native';

export type TopNavigationBarProps<LeftProps, RightProps> = {
  Title?: React.ReactElement;
  Left?: React.ComponentType<LeftProps> | React.ReactElement | null | undefined;
  LeftProps?: LeftProps;
  Right?:
    | React.ComponentType<RightProps>
    | React.ReactElement
    | null
    | undefined;
  RightProps?: RightProps;
  containerStyle?: StyleProp<ViewStyle>;
};

export type TopNavigationBarComponentType<LeftProps, RightProps> =
  React.ComponentType<TopNavigationBarProps<LeftProps, RightProps>>;

export type TopNavigationBarElementType<LeftProps, RightProps> =
  React.ReactElement<TopNavigationBarProps<LeftProps, RightProps>>;
