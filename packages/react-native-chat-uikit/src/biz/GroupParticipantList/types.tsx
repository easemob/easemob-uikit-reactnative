import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type { ListRequestProps, PropsWithError, PropsWithTest } from '../types';
export type GroupParticipantListPageProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type GroupParticipantListProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
  };
export type SearchGroupParticipantProps<DataT> = ListRequestProps<DataT> &
  PropsWithTest &
  PropsWithError & {
    containerStyle?: StyleProp<ViewStyle>;
    onCancel?: () => void;
  };
