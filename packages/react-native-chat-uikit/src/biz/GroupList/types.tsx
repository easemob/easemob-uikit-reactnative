import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type { ListRequestProps, PropsWithError, PropsWithTest } from '../types';
export type GroupListPageProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type GroupListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type SearchGroupProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
