import type { StyleProp, ViewStyle } from 'react-native';

import type { ListRequestProps, PropsWithError, PropsWithTest } from '../types';

export type ContactListProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
