import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, GroupParticipantModel } from '../../chat';
import type { DefaultComponentModel } from '../ListSearch';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
} from '../types';

export type GroupParticipantListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    groupId: string;
    containerStyle?: StyleProp<ViewStyle>;
    onBack?: () => void;
    onSearch?: () => void;
  };

export type GroupParticipantListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: GroupParticipantModel;
  };

export type SearchGroupParticipantProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    groupId: string;
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
export type UseGroupParticipantListProps = GroupParticipantListProps;
export type UseSearchGroupParticipantProps = SearchGroupParticipantProps;
export type GroupParticipantSearchModel = GroupParticipantModel &
  DefaultComponentModel;
