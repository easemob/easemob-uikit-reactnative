import { SectionListData, StyleProp, ViewStyle } from 'react-native';

import { BlockModel, DataModel } from '../../chat';
import { IndexModel } from '../ListIndex';
import {
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
} from '../types';

export type BlockListItemComponentType =
  | React.ComponentType<BlockListItemProps>
  | React.ExoticComponent<BlockListItemProps>;
export type BlockListItemHeaderComponentType =
  | React.ComponentType<SectionListData<BlockListItemProps, IndexModel>>
  | React.ExoticComponent<SectionListData<BlockListItemProps, IndexModel>>;

/**
 * Block list item component properties.
 */
export type BlockListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<ListItemActions<BlockModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    /**
     * Block data model.
     */
    section: BlockModel;
  };

/**
 * Block list component properties.
 */
export type BlockListProps = PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  PropsWithSectionList<BlockListItemProps, IndexModel> &
  PropsWithMenu &
  BlockListNavigationBarProps &
  Omit<ListActions<BlockModel>, 'onToRightSlideItem' | 'onToLeftSlideItem'> & {
    /**
     * Component style properties.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Component for custom list items.
     */
    ListItemRender?: BlockListItemComponentType;
    /**
     * Component for custom list item headers.
     */
    ListItemHeaderRender?: BlockListItemHeaderComponentType;
    /**
     * Callback notification of list data status. For example: the session list usually changes from loading state to normal state. If the data request fails, an error state will be reached.
     */
    onStateChanged?: (state: ListStateType) => void;

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
     * Whether to display the list item header.
     */
    isVisibleItemHeader?: boolean;

    /**
     * Whether to display the index.
     */
    isVisibleIndex?: boolean;
  };

/**
 * Navigation bar component properties for block list items.
 */
export type BlockListNavigationBarProps = PropsWithNavigationBar &
  PropsWithBack & {};

/**
 * Block search component properties.
 */
export type SearchBlockProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithCancel &
  Omit<
    ListItemActions<BlockModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    /**
     * Component style properties.
     */
    containerStyle?: StyleProp<ViewStyle>;
  };

export type BlockSearchModel = BlockModel &
  DataModel & {
    /**
     * Callback notification when the check button is clicked.
     */
    onCheckClicked?: ((data?: BlockModel) => void) | undefined;
  };
