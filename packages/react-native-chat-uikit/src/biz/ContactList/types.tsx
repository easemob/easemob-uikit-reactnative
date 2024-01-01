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
  Omit<ListItemActions<ContactModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    section: ContactModel;
    contactType: ContactType;
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  };

export type ContactListNavigationBarProps = PropsWithBack &
  PropsWithNavigationBar & {
    contactType: ContactType;
    onClickedNewContact?: () => void;
    onCreateGroupResultValue?: (data?: ContactModel[]) => void;
    onAddGroupParticipantResult?: (added: ContactModel[]) => void;
    selectedData?: ContactModel[]; // todo: changed to selectedData
  };
export type ContactListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithInit &
  PropsWithSearch &
  ContactListNavigationBarProps &
  Omit<ListItemActions<ContactModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    containerStyle?: StyleProp<ViewStyle>;
    isHasNewRequest?: boolean;
    isHasGroupList?: boolean;
    onContextMenuMoreActions?: React.ReactElement<ContactItemProps>[];
    onSort?: (
      prevProps: ContactListItemProps,
      nextProps: ContactListItemProps
    ) => number;
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
  'onToRightSlide' | 'onToLeftSlide'
> & {
  onRequestCloseMenu: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  selectedCount?: number;
  selectedMemberCount: number;
  requestCount: number;
  groupCount: number;
  avatarUrl: string | undefined;
  onClickedNewGroup?: () => void;
  onClickedCreateGroup?: () => void;
  onClickedNewContact?: () => void;
  onClickedAddGroupParticipant?: () => void;
};

export type ContactSearchModel = ContactModel &
  DefaultComponentModel & {
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  };
export type UseSearchContactProps = SearchContactProps;
