import type { StyleProp, ViewStyle } from 'react-native';

import type {
  DataModel,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
} from '../types';

export type ContactListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type ContactListPageProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type SearchContactProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
