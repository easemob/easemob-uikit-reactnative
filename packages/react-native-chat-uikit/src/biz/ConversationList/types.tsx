import type { StyleProp, ViewStyle } from 'react-native';

import type { ListRequestProps, PropsWithError, PropsWithTest } from '../types';

export type ConversationListProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type SearchConversationProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
