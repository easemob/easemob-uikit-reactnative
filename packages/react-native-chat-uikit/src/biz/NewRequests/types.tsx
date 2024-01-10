import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, NewRequestModel } from '../../chat';
import type {
  ListActions,
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
  Omit<ListItemActions<NewRequestModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
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
    ListActions<NewRequestModel>,
    'onToRightSlideItem' | 'onToLeftSlideItem'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
    onButtonClicked?: (data?: NewRequestModel | undefined) => void;
    onSort?: (
      prevProps: NewRequestsItemProps,
      nextProps: NewRequestsItemProps
    ) => number;
    ListItemRender?: NewRequestsItemComponentType;
  };
