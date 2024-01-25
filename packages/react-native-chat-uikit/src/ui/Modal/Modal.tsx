// ref: https://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/showcase/bottomSheet/index.tsx
// When using Model in React Native, the inner FlatList cannot be scrolled. ref: https://zhuanlan.zhihu.com/p/630696822

import * as React from 'react';
import {
  Animated,
  ColorValue,
  GestureResponderEvent,
  Modal as RNModal,
  ModalProps as RNModalProps,
  PanResponderGestureState,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';

import { g_mask_color } from '../../const';
import { useModalAnimation, useModalPanResponder } from './Modal.hooks';
import type { ModalAnimationType } from './types';

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

/**
 * @deprecated 2023-11-28 Please use `SlideModal` instead.
 *
 * Mainly solves the effect problem of native modal component `RNModal` display mask.
 */
export function Modal(props: ModalProps) {
  const {
    propsRef,
    modalAnimationType,
    modalStyle,
    onRequestModalClose,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = false,
    children,
    onMoveShouldSetPanResponder,
    onFinished,
    ...others
  } = props;
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  const [visible, setVisible] = React.useState(false);

  if (propsRef.current) {
    propsRef.current.startShow = () => {
      setVisible(true);
      startShow();
    };
    propsRef.current.startHide = (onf?: () => void) => {
      startHide(() => {
        setVisible(false);
        onf?.();
        onFinished?.();
      });
    };
  }

  return (
    <RNModal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onRequestModalClose}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
      {...others}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (disableBackgroundClose !== true) {
            onRequestModalClose();
          }
        }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                backgroundTransparent === true
                  ? undefined
                  : backgroundColor ?? g_mask_color,
              opacity: backgroundTransparent === true ? 0 : backgroundOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: 'flex-end',
            opacity: modalAnimationType === 'fade' ? backgroundOpacity : 1,
            transform: [{ translateY: translateY }],
          },
          modalStyle,
        ]}
        pointerEvents="box-none"
        {...useModalPanResponder({
          type: modalAnimationType,
          translateY,
          startShow,
          onRequestModalClose,
          onMoveShouldSetPanResponder,
        }).panHandlers}
      >
        {/*
          // NOTE: https://github.com/facebook/react-native/issues/14295
          // Subcomponents need to be wrapped in `Pressable` to support sliding operations.
          // example: <Pressable>{children}</Pressable>
          // Note: Nested `FlatList` components are not supported, otherwise the list cannot be scrolled. It is recommended to use the `SimuModal` component.
         */}
        {/* {children} */}
        <Pressable>{children}</Pressable>
      </Animated.View>
    </RNModal>
  );
}
