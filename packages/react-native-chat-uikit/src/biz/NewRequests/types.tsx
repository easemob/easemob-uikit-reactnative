import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, NewRequestModel } from '../../chat';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  PropsWithError,
  PropsWithTest,
} from '../types';

export type NewRequestsProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithError &
  Omit<
    ListItemActions<NewRequestModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onButtonClicked?: (data?: NewRequestModel | undefined) => void;
    onSort?: (
      prevProps: NewRequestsItemProps,
      nextProps: NewRequestsItemProps
    ) => number;
  };
export type UseNewRequestsProps = NewRequestsProps;
export type NewRequestsItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<NewRequestModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: NewRequestModel;
    onButtonClicked?: (data?: NewRequestModel | undefined) => void;
  };
