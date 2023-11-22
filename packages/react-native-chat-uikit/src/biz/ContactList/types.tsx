import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type { ListRequestProps, PropsWithError, PropsWithTest } from '../types';

export type ContactListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    type: 'contact-list' | 'new-contact-list';
  };
export type SearchContactProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
    type: 'contact-list' | 'new-contact-list';
  };
