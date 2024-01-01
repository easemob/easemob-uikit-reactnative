import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, GroupModel } from '../../chat';
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

export type GroupListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: GroupModel;
  };

export type GroupListItemComponentType =
  | React.ComponentType<GroupListItemProps>
  | React.ExoticComponent<GroupListItemProps>;

export type GroupListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onNoMore?: () => void;
    ListItemRender?: GroupListItemComponentType;
  };
export type SearchGroupProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithCancel &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type UseGroupListProps = GroupListProps;

export type GroupSearchModel = GroupModel & DefaultComponentModel;
export type UseSearchGroupProps = SearchGroupProps;
