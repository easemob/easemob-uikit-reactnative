import type { StyleProp, ViewStyle } from 'react-native';

import type {
  DataModel,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
} from '../types';
export type ConversationListPageProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type ConversationListProps = ListRequestProps<DataModel> &
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
