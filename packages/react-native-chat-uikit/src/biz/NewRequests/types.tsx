import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type { ListRequestProps, PropsWithError, PropsWithTest } from '../types';
export type NewRequestsPageProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type NewRequestsProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type SearchNewRequestProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
