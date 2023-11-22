import type { AlertButton } from 'react-native';

export type AlertProps = {
  title?: string;
  message?: string;
  buttons?: Omit<AlertButton, 'isPreferred'>[];
  supportInput?: boolean;
};
