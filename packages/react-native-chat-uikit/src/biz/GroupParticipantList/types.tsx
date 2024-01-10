import type { StyleProp, ViewStyle } from 'react-native';

import type {
  DataModel,
  GroupParticipantModel,
  ResultCallback,
} from '../../chat';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { DefaultComponentModel } from '../ListSearch';
import type {
  GroupParticipantType,
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithBack,
  PropsWithError,
  PropsWithInit,
  PropsWithNavigationBar,
  PropsWithSearch,
  PropsWithTest,
} from '../types';

/**
 * Properties of the group member list navigation bar. The navigation bar supports operations such as displaying the member list, adding members, deleting members, and changing the group owner.
 */
export type GroupParticipantListNavigationBarProps = PropsWithBack &
  PropsWithNavigationBar & {
    /**
     * Group member list type. Classification is mainly based on actual usage scenarios. Currently, it includes displaying the group member list, deleting members, changing the group owner, etc.
     */
    participantType?: GroupParticipantType;
    /**
     * Under the group member list, add member callback notifications. `participantType = 'common'` {@link GroupParticipantType}
     */
    onClickedAddParticipant?: () => void;
    /**
     * Under the group member list, delete member callback notifications. `participantType = 'common'` {@link GroupParticipantType}
     */
    onClickedDelParticipant?: () => void;
    /**
     * Callback notification for deleting group members.
     */
    onDelParticipant?: (data?: GroupParticipantModel[]) => void;
    /**
     * Callback notification for changing the group owner.
     */
    onChangeOwner?: (data?: GroupParticipantModel) => void;
  };
export type GroupParticipantListProps = Pick<
  ListRequestProps<DataModel>,
  'onRequestGroupData'
> &
  PropsWithTest &
  PropsWithError &
  PropsWithInit &
  PropsWithSearch &
  GroupParticipantListNavigationBarProps &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    groupId: string;
    containerStyle?: StyleProp<ViewStyle>;
    ListItemRender?: GroupParticipantListItemComponentType;
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

export type GroupParticipantListItemComponentType =
  | React.ComponentType<GroupParticipantListItemProps>
  | React.ExoticComponent<GroupParticipantListItemProps>;

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

export type SelectSingleParticipantProps = Pick<
  GroupParticipantListProps,
  'groupId' | 'containerStyle' | 'onBack' | 'onClicked' | 'onError' | 'testMode'
> & {
  onSelectResult?: ResultCallback<GroupParticipantModel>;
};

export type UseGroupParticipantListReturn = {
  participantCount: number;
  onCheckClicked?: ((data?: GroupParticipantModel) => void) | undefined;
  onClickedAddParticipant?: () => void;
  onClickedDelParticipant?: () => void;
  onDelParticipant?: () => void;
  deleteCount: number;
  alertRef: React.MutableRefObject<AlertRef>;
  onRequestCloseMenu: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  ListItemRender: GroupParticipantListItemComponentType;
};

export type UseGroupParticipantListProps = GroupParticipantListProps;
export type UseSearchGroupParticipantProps = SearchGroupParticipantProps;
export type GroupParticipantSearchModel = GroupParticipantModel &
  DefaultComponentModel;
