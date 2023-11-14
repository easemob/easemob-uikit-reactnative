import * as React from 'react';
import {
  Animated,
  ColorValue,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { g_mask_color } from '../../const';
import { DefaultSlide, SlideProps } from './DefaultSlide';
import {
  useSimulativeModalAnimation,
  useSimulativeModalPanResponder,
} from './SimuModal.hooks';
import type { ModalAnimationType } from './types';

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
 * Simulate a modal window.
 */
export function SimulativeModal(props: SimulativeModalProps) {
  const {
    modalAnimationType,
    modalStyle,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = false,
    children,
    propsRef,
    onStartShouldSetPanResponder,
    onFinished,
    maskStyle,
    Slide,
    ...others
  } = props;
  const { translateY, startShow, startHide, backgroundOpacity } =
    useSimulativeModalAnimation(modalAnimationType);
  const { width, height } = useWindowDimensions();
  const [modalVisible, setModalVisible] = React.useState(false);
  const _Slide = Slide ?? DefaultSlide;

  if (propsRef) {
    if (propsRef.current) {
      propsRef.current.startShow = () => {
        setModalVisible(true);
        startShow();
      };
      propsRef.current.startHide = (onf?: () => void) => {
        startHide(() => {
          setModalVisible(false);
          onf?.();
          onFinished?.();
        });
      };
    }
  }

  return (
    <View
      style={[
        {
          flex: 1,
          position: 'absolute',
          width: width,
          height: height,
          display: modalVisible === true ? 'flex' : 'none',
          // opacity: modalVisible === true ? 1 : 0,
        },
        maskStyle,
      ]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (disableBackgroundClose !== true) {
            startHide(() => setModalVisible(false));
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
            opacity: modalVisible === true ? backgroundOpacity : 0,
            transform: [{ translateY: translateY }],
          },
          modalStyle,
        ]}
        pointerEvents="box-none"
        // {...useSimulativeModalPanResponder({
        //   type: modalAnimationType,
        //   translateY,
        //   startShow,
        //   startHide,
        //   setModalVisible,
        //   onStartShouldSetPanResponder,
        // }).panHandlers}
        {...others}
      >
        <_Slide
          modalType={'simu-modal'}
          {...useSimulativeModalPanResponder({
            type: modalAnimationType,
            translateY,
            startShow,
            startHide,
            setModalVisible,
            onStartShouldSetPanResponder,
          }).panHandlers}
        />
        {children}
      </Animated.View>
    </View>
  );
}
