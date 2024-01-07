import type { SectionListData, StyleProp, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import type { ContactModel, DataModel } from '../../chat';
import type { IndexModel } from '../ListIndex';
import type {
  ContactType,
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  ListStateType,
  PropsWithBack,
  PropsWithCancel,
  PropsWithError,
  PropsWithInit,
  PropsWithMenu,
  PropsWithNavigationBar,
  PropsWithSearch,
  PropsWithSectionList,
  PropsWithTest,
  SearchType,
  SectionListRefType,
} from '../types';

export type ContactListItemComponentType =
  | React.ComponentType<ContactListItemProps>
  | React.ExoticComponent<ContactListItemProps>;
export type ContactListItemHeaderComponentType =
  | React.ComponentType<SectionListData<ContactListItemProps, IndexModel>>
  | React.ExoticComponent<SectionListData<ContactListItemProps, IndexModel>>;

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

export type ContactListRef = Omit<
  SectionListRefType<ContactModel, ContactListItemProps, IndexModel>,
  'updateItem' | 'clearItem'
> & {
  /**
   * update data model. Contact `remark`, `avatar` and `nickName` can be updated through `onRequestData`. Others cannot be updated.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  updateItem: (items: ContactModel) => void;
};

export type ContactListNavigationBarProps = PropsWithNavigationBar &
  PropsWithBack & {
    contactType: ContactType;
    onClickedNewContact?: () => void;
    onCreateGroupResultValue?: (data?: ContactModel[]) => void;
    onAddGroupParticipantResult?: (added: ContactModel[]) => void;
    selectedData?: ContactModel[]; // todo: changed to selectedData
  };

export type ContactListProps = Pick<
  ListRequestProps<DataModel>,
  'onRequestMultiData'
> &
  PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  ContactListNavigationBarProps &
  PropsWithSectionList<ContactListItemProps, IndexModel> &
  PropsWithMenu &
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
    ListItemRender?: ContactListItemComponentType;
    ListItemHeaderRender?: ContactListItemHeaderComponentType;
    /**
     * Callback notification of list data status. For example: the session list usually changes from loading state to normal state. If the data request fails, an error state will be reached.
     */
    onStateChanged?: (state: ListStateType) => void;
    propsRef?: React.MutableRefObject<ContactListRef>;
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

export type ContactSearchModel = ContactModel &
  DataModel & {
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
  };
