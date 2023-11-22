import type { StyleProp, ViewStyle } from 'react-native';

import type { ConversationModel, DataModel } from '../../chat';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
} from '../types';

export type ConversationListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<ConversationModel>,
    'onToRightSlide' | 'onToLeftSlide'
  > & {
    data: ConversationModel;
  };

export type ConversationListPageProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<ConversationModel>,
    'onToRightSlide' | 'onToLeftSlide'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    sort?: (
      prevProps: ConversationListItemProps,
      nextProps: ConversationListItemProps
    ) => boolean;
  };
export type ConversationListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type SearchConversationProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
export type UseConversationListReturn = {
  onRemove: (conv: ConversationModel) => void;
  onPin: (conv: ConversationModel) => void;
  onDisturb: (conv: ConversationModel) => void;
  onRead: (conv: ConversationModel) => void;
  onRequestModalClose: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
};
export type useConversationListProps = ConversationListPageProps;
