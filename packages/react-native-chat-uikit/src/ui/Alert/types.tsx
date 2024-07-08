import type { AlertButton, StyleProp, ViewStyle } from 'react-native';

import { TextInputProps } from '../TextInput';

export type AlertRef = {
  alert: () => void;
  alertWithInit: (props: AlertProps) => void;
  close: (onFinished?: () => void) => void;
};

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
  inputProps?: TextInputProps;
};

export type AlertContextType = {
  getAlertRef: () => AlertRef;
};
