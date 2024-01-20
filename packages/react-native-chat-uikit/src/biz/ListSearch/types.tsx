import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithCancel,
  PropsWithError,
  PropsWithTest,
  SearchType,
} from '../types';

/**
 * List Search Component model.
 */
export type DefaultComponentModel = DataModel;

/**
 * List Search Item Component.
 */
export type ListSearchItemComponent<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = React.FC<ListSearchItemProps<ComponentModel>>;

/**
 * List Search Item Component properties.
 */
export type ListSearchItemProps<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<ComponentModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    /**
     * Data model. The data model is generic. For example: `GroupSearchModel`, `ContactSearchModel`, `ConversationSearchModel` etc.
     */
    data: ComponentModel;
    /**
     * Search keyword.
     */
    keyword: string;
    /**
     * Search type.
     */
    searchType: SearchType;
  };

/**
 * List Search Component properties.
 */
export type ListSearchProps<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithCancel &
  Omit<
    ListItemActions<ComponentModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    /**
     * Container style for the list search component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Search type.
     */
    searchType: SearchType;
    /**
     * Initial data.
     */
    initData?:
      | ReadonlyArray<ComponentModel>
      | (() => Promise<ReadonlyArray<ComponentModel>>)
      | (() => ReadonlyArray<ComponentModel>);
    /**
     * Callback notification when the search keyword changes.
     */
    onSearch?:
      | ((keyword: string) => Promise<ReadonlyArray<ComponentModel>>)
      | ((keyword: string) => ReadonlyArray<ComponentModel>);
    /**
     * @description Custom item rendering.
     *
     * It is automatically wrapped using `React.memo` technology.
     */
    ItemRender?: ListSearchItemComponent<ComponentModel>;
  };

/**
 * List Search Component.
 */
export type UseListSearchProps<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = ListSearchProps<ComponentModel>;
