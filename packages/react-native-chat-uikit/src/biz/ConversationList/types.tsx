import type { StyleProp, ViewStyle } from 'react-native';

import type { ConversationModel, DataModel } from '../../chat';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { DefaultComponentModel } from '../ListSearch';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithBack,
  PropsWithCancel,
  PropsWithError,
  PropsWithInit,
  PropsWithNavigationBar,
  PropsWithSearch,
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

export type ConversationListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
  Omit<
    ListItemActions<ConversationModel>,
    'onToRightSlide' | 'onToLeftSlide'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onSort?: (
      prevProps: ConversationListItemProps,
      nextProps: ConversationListItemProps
    ) => number;
    onClickedNewConversation?: () => void;
    onClickedNewGroup?: () => void;
    onClickedNewContact?: () => void;
  };
export type SearchConversationProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithCancel &
  Omit<
    ListItemActions<ConversationModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
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
export type UseConversationListProps = ConversationListProps;
export type UseSearchConversationProps = SearchConversationProps;
export type ConversationSearchModel = ConversationModel & DefaultComponentModel;
