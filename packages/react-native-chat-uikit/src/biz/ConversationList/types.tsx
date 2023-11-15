import type { StyleProp, ViewStyle } from 'react-native';

import type { ListRequestProps } from '../types';

export type ConversationListProps<DataT> = ListRequestProps<DataT> & {
  containerStyle?: StyleProp<ViewStyle>;
};
export type SearchConversationProps<DataT> = ListRequestProps<DataT> & {
  containerStyle?: StyleProp<ViewStyle>;
  onCancel: () => void;
};
