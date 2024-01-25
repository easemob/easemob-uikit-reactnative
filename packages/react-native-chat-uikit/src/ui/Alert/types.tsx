import type { AlertButton, StyleProp, ViewStyle } from 'react-native';

export type AlertProps = {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  supportInput?: boolean;
  supportInputStatistics?: boolean;
  inputMaxCount?: number;
  isSaveInput?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  enableClearButton?: boolean;
  autoFocus?: boolean | undefined;
};
