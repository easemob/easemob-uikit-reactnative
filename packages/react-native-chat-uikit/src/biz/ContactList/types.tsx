import type { StyleProp, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import type { ContactModel, DataModel } from '../../chat';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { DefaultComponentModel } from '../ListSearch';
import type {
  ContactType,
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
  SearchType,
} from '../types';

export type ContactItemProps = {
  icon?: IconNameType;
  name: string;
  count?: React.ReactElement;
  hasArrow?: boolean;
  onClicked?: () => void;
};

export type ContactListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<ContactModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    section: ContactModel;
    contactType: ContactType;
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  };

export type ContactListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<ContactModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    contactType: ContactType;
    isHasNewRequest?: boolean;
    isHasGroupList?: boolean;
    onContextMenuMoreActions?: React.ReactElement<ContactItemProps>[];
    onSort?: (
      prevProps: ContactListItemProps,
      nextProps: ContactListItemProps
    ) => number;
    onSearch?: () => void;
    onCancel?: () => void;
    onNavigationBarMoreActions?: () => void;
    onNewConversation?: () => void;
    onNewGroup?: () => void;
    onNewContact?: () => void;
    onCreateGroup?: (data?: ContactModel[]) => void;
    selectedData?: ContactModel[]; // todo: changed to selectedData
    groupId?: string;
  };

export type SearchContactProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<ContactModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: (data?: ContactModel[]) => void;
    searchType: SearchType;
    groupId?: string;
    // onSelectedResult?: (result: Map<string, boolean>) => void;
  };

export type UseContactListReturn = Omit<
  ListItemActions<ContactModel>,
  'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
> & {
  onRequestModalClose: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  onShowMenu?: () => void;
  alertRef: React.RefObject<AlertRef>;
  onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  selectedCount?: number;
  onNewGroup?: () => void;
  onCreateGroup?: () => void;
};

export type ContactSearchModel = ContactModel &
  DefaultComponentModel & {
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  };
export type UseSearchContactProps = SearchContactProps;
