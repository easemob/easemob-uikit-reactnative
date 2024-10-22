import type {
  ColorValue,
  GestureResponderEvent,
  GestureResponderHandlers,
  ModalProps as RNModalProps,
  PanResponderGestureState,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type ModalAnimationType = 'none' | 'slide' | 'fade' | undefined;

/**
 * Why not use properties to show and hide components? The method of using attributes has been tried, but this method requires more renderings (the function needs to be executed multiple times internally).
 *
 * ref: example/src/__dev__/test_modal_prototype.tsx
 */
export type ModalRef = {
  startShow: (onFinished?: () => void, timeout?: number) => void;
  /**
   * Hiding a component is not destroying it.
   */
  startHide: (onFinished?: () => void, timeout?: number) => void;
};

export type ModalProps = Omit<
  RNModalProps,
  | 'animated'
  | 'animationType'
  | 'transparent'
  | 'visible'
  | 'style'
  | 'onRequestClose'
> & {
  propsRef: React.RefObject<ModalRef>;
  onRequestModalClose: () => void;
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
  onMoveShouldSetPanResponder?:
    | ((
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean)
    | undefined;
  onFinished?: () => void;
  keyboardVerticalOffset?: number | undefined;
  enableSlideComponent?: boolean | undefined;
  enabledKeyboardAdjust?: boolean | undefined;
};

export type ModalType = 'simu-modal' | 'modal';
export type SlideProps = ViewProps &
  GestureResponderHandlers & { modalType: ModalType };

/**
 * Why not use properties to show and hide components? The method of using attributes has been tried, but this method requires more renderings (the function needs to be executed multiple times internally).
 *
 * ref: example/src/__dev__/test_modal_prototype.tsx
 */
export type SimulativeModalRef = {
  startShow: () => void;
  /**
   * Hiding a component is not destroying it.
   */
  startHide: (onFinished?: () => void) => void;
};

export type SimulativeModalProps = Omit<ViewProps, 'style'> & {
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
  propsRef: React.RefObject<SimulativeModalRef>;
  onStartShouldSetPanResponder?:
    | ((
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean)
    | undefined;
  onFinished?: () => void;
  maskStyle?: StyleProp<ViewStyle> | undefined;
  Slide?: React.ComponentType<SlideProps>;
};

/**
 * Why not use properties to show and hide components? The method of using attributes has been tried, but this method requires more renderings (the function needs to be executed multiple times internally).
 *
 * ref: example/src/__dev__/test_modal_prototype.tsx
 */
export type SlideModalRef = ModalRef;

export type SlideModalProps = ModalProps & {
  Slide?: React.ComponentType<SlideProps>;
};
