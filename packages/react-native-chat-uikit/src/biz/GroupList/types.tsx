import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, GroupModel } from '../../chat';
import type { DefaultComponentModel } from '../ListSearch';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
} from '../types';

export type GroupListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onBack?: () => void;
    onSearch?: () => void;
    onNoMore?: () => void;
  };
export type SearchGroupProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
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
