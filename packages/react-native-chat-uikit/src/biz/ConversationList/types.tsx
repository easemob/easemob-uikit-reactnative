import type { StyleProp, ViewStyle } from 'react-native';

import type { ConversationModel, DataModel } from '../../chat';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type {
  FlatListRefType,
  ListActions,
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  ListStateType,
  PropsWithBack,
  PropsWithCancel,
  PropsWithFlatList,
  PropsWithInit,
  PropsWithMenu,
  PropsWithNavigationBar,
  PropsWithSearch,
  PropsWithTest,
} from '../types';

/**
 * Conversation list item component properties.
 */
export type ConversationListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<ConversationModel>,
    'onToRightSlide' | 'onToLeftSlide'
  > & {
    data: ConversationModel;
  };

export type ConversationListItemComponentType =
  | React.ComponentType<ConversationListItemProps>
  | React.ExoticComponent<ConversationListItemProps>;

/**
 * Conversation list component reference.
 */
export type ConversationListRef = Omit<
  FlatListRefType<ConversationModel, ConversationListItemProps>,
  'clearItem' | 'updateItem'
> & {
  /**
   * Add items to the list.
   */
  addItem: (items: ConversationModel) => void;
  /**
   * Supported updated content includes: `unreadMessageCount`, `doNotDisturb`, `ext`. `convName` and `convAvatar` are updated via `onRequestMultiData`. Other fields do not support updating. `unreadMessageCount` can be set to 0 and other values are invalid. If you need to customize it, you can save custom data in the ext field and redefine the `ListItemRender` component to achieve a closed loop process.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  updateItem: (items: ConversationModel) => void;
};

// export type ConversationListInitDataType = {
//   /**
//    * The reference object of the list component. You can control operations such as list scrolling.
//    */
//   flatListRef: React.RefObject<FlatListRef<any>>;
//   /**
//    * The reference object of the alert component. You can control operations such as alert pop-up.
//    */
//   alertRef: React.RefObject<AlertRef>;
//   /**
//    * The reference object of the menu component. You can control operations such as menu pop-up.
//    */
//   menuRef: React.RefObject<BottomSheetNameMenuRef>;
//   /**
//    * The reference object of the list component.
//    */
//   convListRef: React.RefObject<ConversationListRef>;
// };

/**
 * Conversation list component properties.
 */
export type ConversationListProps = Pick<
  ListRequestProps<DataModel>,
  'onRequestMultiData'
> &
  PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
  PropsWithFlatList<ConversationListItemProps> &
  PropsWithMenu &
  Omit<
    ListActions<ConversationModel>,
    'onToRightSlideItem' | 'onToLeftSlideItem'
  > & {
    /**
     * Container style for the session list component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The default sorting is based on the timestamp of the last message in the conversation and whether it is pinned to the top.
     * @param prevProps
     * @param nextProps
     * @returns -1, 0, 1
     */
    onSort?: (
      prevProps: ConversationListItemProps,
      nextProps: ConversationListItemProps
    ) => number;
    /**
     * Click the callback notification for a new session. Usually the application layer is required to jump to the new session page.
     */
    onClickedNewConversation?: () => void;
    /**
     * Callback notification when the Create New Group button is clicked. Usually the application layer is required to jump to the new group page.
     */
    onClickedNewGroup?: () => void;
    /**
     * Callback notification when the Create New Contact button is clicked. Usually the application layer is required to jump to the new contact page.
     */
    onClickedNewContact?: () => void;
    /**
     * Custom session list item component. This component can be customized if the provided settings do not meet your requirements.
     */
    ListItemRender?: ConversationListItemComponentType;
    /**
     * Callback notification of list data status. For example: the session list usually changes from loading state to normal state. If the data request fails, an error state will be reached.
     */
    onStateChanged?: (state: ListStateType) => void;

    /**
     * The reference object of the conversation list component.
     *
     * Please see {@link ConversationListRef} for more operations.
     */
    propsRef?: React.MutableRefObject<ConversationListRef>;

    /**
     * Callback notification for initializing the bottom menu for navigation bar.
     */
    onInitNavigationBarMenu?: (
      initItems: InitMenuItemsType[]
    ) => InitMenuItemsType[];
    /**
     * Callback notification for initializing the bottom menu for long press list item.
     */
    onInitBottomMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
    /**
     * filter empty conversation.
     */
    filterEmptyConversation?: boolean;
  };

/**
 * Conversation search component properties.
 */
export type SearchConversationProps = PropsWithTest &
  PropsWithCancel &
  Omit<
    ListItemActions<ConversationModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * filter empty conversation.
     */
    filterEmptyConversation?: boolean;
  };

export type ConversationSearchModel = ConversationModel & DataModel;
