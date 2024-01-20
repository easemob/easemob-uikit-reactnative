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

/**
 * New Requests Item Component properties.
 */
export type NewRequestsItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<ListItemActions<NewRequestModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    /**
     * Data model.
     */
    data: NewRequestModel;
    /**
     * Callback notification when the button is clicked.
     */
    onButtonClicked?: (data?: NewRequestModel | undefined) => void;
  };

/**
 * New Requests Item Component type.
 */
export type NewRequestsItemComponentType =
  | React.ComponentType<NewRequestsItemProps>
  | React.ExoticComponent<NewRequestsItemProps>;

/**
 * New Requests Component properties.
 */
export type NewRequestsProps = PropsWithTest &
  PropsWithError &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
  Omit<
    ListActions<NewRequestModel>,
    'onToRightSlideItem' | 'onToLeftSlideItem'
  > & {
    /**
     * Container style for the new requests component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Callback notification when the button is clicked.
     */
    onButtonClicked?: (data?: NewRequestModel | undefined) => void;
    /**
     * Callback notification when the list is sorted.
     * @returns [-1, 0, 1]
     */
    onSort?: (
      prevProps: NewRequestsItemProps,
      nextProps: NewRequestsItemProps
    ) => number;
    /**
     * New Requests Item Component.
     */
    ListItemRender?: NewRequestsItemComponentType;
  };
