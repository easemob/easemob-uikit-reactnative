import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
  SearchType,
} from '../types';

export type DefaultComponentModel = {
  id: string;
  name: string;
};

export type ListSearchItemComponent<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = React.FC<ListSearchItemProps<ComponentModel>>;

export type ListSearchItemProps<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<ComponentModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: ComponentModel;
    keyword: string;
    searchType: SearchType;
  };

export type ListSearchProps<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<ComponentModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
    searchType: SearchType;
    initData?:
      | ReadonlyArray<ComponentModel>
      | (() => Promise<ReadonlyArray<ComponentModel>>)
      | (() => ReadonlyArray<ComponentModel>);
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

export type useListSearchProps<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = ListSearchProps<ComponentModel>;

export type UseSearchReturn<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
> = {
  onSearch?:
    | ((keyword: string) => Promise<ReadonlyArray<ComponentModel>>)
    | ((keyword: string) => ReadonlyArray<ComponentModel>);
  onClicked?: (data?: ComponentModel) => void;
};
