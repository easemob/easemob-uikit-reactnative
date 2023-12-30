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
  PropsWithBack,
  PropsWithCancel,
  PropsWithError,
  PropsWithInit,
  PropsWithNavigationBar,
  PropsWithSearch,
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
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
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
    onNavigationBarMoreActions?: () => void;
    onClickedNewContact?: () => void;
    onCreateGroupResultValue?: (data?: ContactModel[]) => void;
    onAddGroupParticipantResult?: (added: ContactModel[]) => void;
    selectedData?: ContactModel[]; // todo: changed to selectedData
    groupId?: string;
    onClickedNewRequest?: () => void;
    onClickedGroupList?: () => void;
  };

export type SearchContactProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithCancel &
  Omit<
    ListItemActions<ContactModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
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
  alertRef: React.RefObject<AlertRef>;
  onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  selectedCount?: number;
  onClickedNewGroup?: () => void;
  onClickedCreateGroup?: () => void;
};

export type ContactSearchModel = ContactModel &
  DefaultComponentModel & {
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  };
export type UseSearchContactProps = SearchContactProps;
