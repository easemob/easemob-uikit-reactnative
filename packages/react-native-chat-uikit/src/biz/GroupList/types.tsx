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
  PropsWithSearch,
  PropsWithTest,
} from '../types';

export type GroupListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onNoMore?: () => void;
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
export type GroupListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: GroupModel;
  };
export type GroupSearchModel = GroupModel & DefaultComponentModel;
export type UseSearchGroupProps = SearchGroupProps;
