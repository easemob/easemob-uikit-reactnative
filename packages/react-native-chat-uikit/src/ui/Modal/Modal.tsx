// ref: https://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/showcase/bottomSheet/index.tsx
// When using Model in React Native, the inner FlatList cannot be scrolled. ref: https://zhuanlan.zhihu.com/p/630696822

import * as React from 'react';
import {
  Animated,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { g_mask_color } from '../../const';
import { useModalAnimation, useModalPanResponder } from './Modal.hooks';
import type { ModalProps } from './types';

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
