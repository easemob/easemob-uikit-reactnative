import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, NewRequestModel } from '../../chat';
import type {
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  PropsWithBack,
  PropsWithError,
  PropsWithNavigationBar,
  PropsWithSearch,
  PropsWithTest,
} from '../types';

export type NewRequestsItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<
    ListItemActions<NewRequestModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    data: NewRequestModel;
    onButtonClicked?: (data?: NewRequestModel | undefined) => void;
  };

export type NewRequestsItemComponentType =
  | React.ComponentType<NewRequestsItemProps>
  | React.ExoticComponent<NewRequestsItemProps>;

export type NewRequestsProps = PropsWithTest &
  PropsWithError &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
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
    ListItemRender?: NewRequestsItemComponentType;
  };
export type UseNewRequestsProps = NewRequestsProps;
export type UseNewRequestsReturn = {
  onButtonClicked?: (data?: NewRequestModel | undefined) => void;
  ListItemRender: NewRequestsItemComponentType;
};
