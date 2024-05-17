import type { SectionListData, StyleProp, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import type { ContactModel, DataModel } from '../../chat';
import type { IndexModel } from '../ListIndex';
import type {
  ContactType,
  ListActions,
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

/**
 * Contact list item component properties.
 *
 * @example
 *
 * ```tsx
 * <ContactItem
 *   name={tr('new request')}
 *   count={<Badges count={requestCount} />}
 *   hasArrow={true}
 *   onClicked={onClickedNewRequest}
 * />
 * ```
 */
export type ContactItemProps = {
  /**
   * Icon name.
   */
  icon?: IconNameType;
  /**
   * Name.
   */
  name: string;
  /**
   * Count component.
   */
  count?: React.ReactElement;
  /**
   * Whether to display the arrow.
   */
  hasArrow?: boolean;
  /**
   * Callback when the item is clicked.
   */
  onClicked?: () => void;
};

/**
 * Contact list item component properties.
 */
export type ContactListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<ListItemActions<ContactModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    /**
     * Contact data model.
     */
    section: ContactModel;
    /**
     * Contact type.
     *
     * In addition to managing contacts, the contact list component can also be used in scenarios such as creating groups and adding group members. Different types will have different styles and data handling.
     *
     * See details {@link ContactType}
     */
    contactType: ContactType;
    /**
     * Callback when the item check button is clicked.
     */
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;

    /**
     * Callback when the item forward button is clicked.
     */
    onForwardClicked?: ((data?: ContactModel) => void) | undefined;
  };

/**
 * A reference to the Contact component.
 *
 * The list can usually be added, deleted, modified, or checked.
 */
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

/**
 * Navigation bar component properties for contact list items.
 */
export type ContactListNavigationBarProps = PropsWithNavigationBar &
  PropsWithBack & {
    /**
     * Contact type.
     *
     * Contact components can be reused in many situations. For example: create groups, create new conversations, share business cards, etc. This type is used to distinguish them.
     */
    contactType: ContactType;
    /**
     * Callback when the navigation bar button is clicked.
     */
    onClickedNewContact?: () => void;
    /**
     * When the contact type is `create-group`, callback notification of the result of creating the group.
     */
    onCreateGroupResultValue?: (data?: ContactModel[]) => void;
    /**
     * When the contact type is `add-group-member`, callback notification of the result of add group member.
     */
    onAddGroupParticipantResult?: (added: ContactModel[]) => void;
    /**
     * When the contact type is `create-group` or `add-group-member` or `forward-message`, Pass in the selected contacts.
     */
    selectedData?: ContactModel[]; // todo: changed to selectedData
  };

/**
 * Contact list component properties.
 */
export type ContactListProps = PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  ContactListNavigationBarProps &
  PropsWithSectionList<ContactListItemProps, IndexModel> &
  PropsWithMenu &
  Omit<
    ListActions<ContactModel>,
    'onToRightSlideItem' | 'onToLeftSlideItem'
  > & {
    /**
     * Component style properties.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Callback for initializing individual list items. The input is the default component and the updated component is returned.
     *
     * The default includes contact application list and group list.
     */
    onInitListItemActions?: (
      defaultItems: React.ReactElement<ContactItemProps>[]
    ) => React.ReactElement<ContactItemProps>[];
    /**
     * Customize the sorting of the list. By default, the pinned list items are at the front and sorted by timestamp from large to small.
     *
     * @returns {number} -1: prevProps < nextProps, 0: prevProps = nextProps, 1: prevProps > nextProps
     */
    onSort?: (
      prevProps: ContactListItemProps,
      nextProps: ContactListItemProps
    ) => number;
    /**
     * When the contact type is `add-group-member`, Need to set groupId
     */
    groupId?: string;
    /**
     * Callback when the request list item is clicked.
     *
     * Usually a page jump is required.
     */
    onClickedNewRequest?: () => void;
    /**
     * Callback when the group list item is clicked.
     *
     * Usually a page jump is required.
     */
    onClickedGroupList?: () => void;
    /**
     * Component for custom list items.
     */
    ListItemRender?: ContactListItemComponentType;

    /**
     * Whether to display the list item header.
     */
    isVisibleItemHeader?: boolean;
    /**
     * Component for custom list item headers.
     */
    ListItemHeaderRender?: ContactListItemHeaderComponentType;
    /**
     * Callback notification of list data status. For example: the session list usually changes from loading state to normal state. If the data request fails, an error state will be reached.
     */
    onStateChanged?: (state: ListStateType) => void;
    /**
     * The reference object of the component. Components can be manipulated. For example: add, modify and delete.
     */
    propsRef?: React.MutableRefObject<ContactListRef>;

    /**
     * Callback notification when forward message.
     */
    onForwardMessage?: (data: ContactModel) => void;

    /**
     * Callback notification when the request count changes.
     */
    onChangeRequestCount?: (count: number) => void;

    /**
     * Get full letter of the string.
     *
     * @param str The string of get full letter.
     * @returns The full letter of the string.
     *
     * @example
     *
     * ```tsx
     * const str = 'Json';
     * const full = getFullLetter(str); // full = 'Json'
     * const str = '金喜善';
     * const full = getFullLetter(str); // full = 'jinxishan'
     * const str = '9527';
     * const full = getFullLetter(str); // full = '9527'
     * ```
     */
    getFullLetter?: (str?: string) => string | undefined;

    /**
     * Index list.
     *
     * default is `ABCDEFGHIJKLMNOPQRSTUVWXYZ#`
     *
     * @example
     *
     * ```tsx
     * const str = '9527';
     * const index = getIndex(str); // index = '#'
     * ```
     */
    indexList?: string[];

    /**
     * Whether to display the empty index.
     *
     * default is `false`
     */
    visibleEmptyIndex?: boolean;

    /**
     * Whether to display the index.
     */
    isVisibleIndex?: boolean;
  };

/**
 * Contact search component properties.
 */
export type SearchContactProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithCancel &
  Omit<
    ListItemActions<ContactModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    /**
     * Component style properties.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Search type.
     */
    searchType: SearchType;
    /**
     * When the contact type is `add-group-member`, Need to set groupId
     */
    groupId?: string;
  };

export type ContactSearchModel = ContactModel &
  DataModel & {
    /**
     * Callback notification when the check button is clicked.
     */
    onCheckClicked?: ((data?: ContactModel) => void) | undefined;
    /**
     * Callback notification when the forward button is clicked.
     */
    onClickedForward?: ((data?: ContactModel) => void) | undefined;
  };
