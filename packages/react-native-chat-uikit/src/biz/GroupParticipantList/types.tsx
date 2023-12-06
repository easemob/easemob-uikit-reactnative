import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, GroupParticipantModel } from '../../chat';
import type { DefaultComponentModel } from '../ListSearch';
import type {
  GroupParticipantType,
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
    participantType?: GroupParticipantType;
    containerStyle?: StyleProp<ViewStyle>;
    onBack?: () => void;
    onSearch?: () => void;
    onClickedAddParticipant?: () => void;
    onClickedDelParticipant?: () => void;
    onDelParticipant?: (data?: GroupParticipantModel[]) => void;
    onChangeOwner?: (data?: GroupParticipantModel) => void;
  };

export type GroupParticipantListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: GroupParticipantModel;
    onCheckClicked?: ((data?: GroupParticipantModel) => void) | undefined;
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
