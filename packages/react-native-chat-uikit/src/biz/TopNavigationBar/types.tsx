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
