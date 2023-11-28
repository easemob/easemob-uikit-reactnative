import type { AlertButton, StyleProp, ViewStyle } from 'react-native';

export type AlertProps = {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  supportInput?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};
