// ref: https://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/showcase/bottomSheet/index.tsx
// When using Model in React Native, the inner FlatList cannot be scrolled. ref: https://zhuanlan.zhihu.com/p/630696822

import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  Modal as RNModal,
  PanResponderGestureState,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { g_mask_color } from '../../const';
import { timeoutTask } from '../../utils';
import { KeyboardAvoidingView } from '../Keyboard';
import { DefaultSlide } from './DefaultSlide';
import { useModalAnimation, useModalPanResponder } from './Modal.hooks';
import type { ModalAnimationType, SlideModalProps, SlideProps } from './types';

/**
 * Mainly solves the effect problem of native modal component `RNModal` display mask.
 */
export function SlideModal(props: SlideModalProps) {
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
    Slide,
    keyboardVerticalOffset,
    enableSlideComponent = true,
    enabledKeyboardAdjust = false,
    ...others
  } = props;
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  const [visible, setVisible] = React.useState(false);

  const SlideWrapper = Slide ?? DefaultSlide;

  if (propsRef.current) {
    propsRef.current.startShow = (onf?: () => void, timeout?: number) => {
      setVisible(true);
      setTimeout(() => {
        if (timeout !== undefined) {
          startShow(() => {
            timeoutTask(timeout, () => {
              onf?.();
            });
          });
        } else {
          startShow(() => {
            onf?.();
          });
        }
      }, 16); // one frame's delay
      // InteractionManager.runAfterInteractions(() => {
      //   if (timeout !== undefined) {
      //     startShow(() => {
      //       timeoutTask(timeout, () => {
      //         onf?.();
      //       });
      //     });
      //   } else {
      //     startShow(() => {
      //       onf?.();
      //     });
      //   }
      // });
      if (timeout !== undefined) {
        startShow(() => {
          timeoutTask(timeout, () => {
            onf?.();
          });
        });
      } else {
        startShow(() => {
          onf?.();
        });
      }
    };
    propsRef.current.startHide = (onf?: () => void, timeout?: number) => {
      // 使用 InteractionManager 确保动画在主线程执行
      // InteractionManager.runAfterInteractions(() => {
      //   if (timeout !== undefined) {
      //     startHide(() => {
      //       // 确保在下一个渲染周期隐藏 Modal
      //       setImmediate(() => {
      //         setVisible(false);
      //         timeoutTask(timeout, () => {
      //           onf?.();
      //           onFinished?.();
      //         });
      //       });
      //     });
      //   } else {
      //     startHide(() => {
      //       setImmediate(() => {
      //         setVisible(false);
      //         onf?.();
      //         onFinished?.();
      //       });
      //     });
      //   }
      // });
      // 先执行动画，不立即隐藏 Modal
      // if (timeout !== undefined) {
      //   startHide(() => {
      //     // 动画完成后再隐藏 Modal
      //     setTimeout(() => {
      //       setVisible(false);
      //       timeoutTask(timeout, () => {
      //         onf?.();
      //         onFinished?.();
      //       });
      //     }, 50); // 给一点缓冲时间
      //   });
      // } else {
      //   startHide(() => {
      //     // 动画完成后再隐藏 Modal
      //     setTimeout(() => {
      //       setVisible(false);
      //       onf?.();
      //       onFinished?.();
      //     }, 50);
      //   });
      // }
      if (timeout !== undefined) {
        startHide(() => {
          setVisible(false);
          timeoutTask(timeout, () => {
            onf?.();
            onFinished?.();
          });
        });
      } else {
        startHide(() => {
          setVisible(false);
          onf?.();
          onFinished?.();
        });
      }
    };
  }

  // return (
  //   <Animated.View
  //     style={[
  //       {
  //         flex: 1,
  //         justifyContent: 'flex-end',
  //         opacity: modalAnimationType === 'fade' ? backgroundOpacity : 1,
  //         transform: [{ translateY: translateY }],
  //       },
  //       modalStyle,
  //     ]}
  //     pointerEvents={'box-none'}
  //   >
  //     {children}
  //   </Animated.View>
  // );

  // return (
  //   <RNModal
  //     transparent={true}
  //     visible={visible}
  //     // animationType="none"
  //     onRequestClose={onRequestModalClose}
  //     supportedOrientations={[
  //       'portrait',
  //       'portrait-upside-down',
  //       'landscape',
  //       'landscape-left',
  //       'landscape-right',
  //     ]}
  //     {...others}
  //   >
  //     <Animated.View
  //       style={[
  //         {
  //           flex: 1,
  //           justifyContent: 'flex-end',
  //           opacity: modalAnimationType === 'fade' ? backgroundOpacity : 1,
  //           transform: [{ translateY: translateY }],
  //         },
  //         modalStyle,
  //       ]}
  //       pointerEvents={'box-none'}
  //     >
  //       {children}
  //     </Animated.View>
  //   </RNModal>
  // );

  return (
    <RNModal
      transparent={true}
      visible={visible}
      // animationType="none"
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
                  : (backgroundColor ?? g_mask_color),
              opacity: backgroundTransparent === true ? 0 : backgroundOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        pointerEvents={'box-none'}
        enabled={enabledKeyboardAdjust}
        style={{ flex: 1 }}
        // Add this attribute to avoid transform conflicts
        // contentContainerStyle={{ flex: 1 }}
      >
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
          pointerEvents={'box-none'}
        >
          <SlideComponent
            Slide={SlideWrapper}
            modalAnimationType={modalAnimationType}
            translateY={translateY}
            startShow={startShow}
            startHide={startHide}
            onRequestModalClose={onRequestModalClose}
            onMoveShouldSetPanResponder={onMoveShouldSetPanResponder}
            enableSlideComponent={enableSlideComponent}
          />

          {/* <View
          style={[
            {
              height: 100,
              width: '100%',
              backgroundColor: 'red',
              alignItems: 'center',
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              transform: [{ translateY: 15 }],
            },
          ]}
          {...useModalPanResponder({
            type: modalAnimationType,
            translateY,
            startShow,
            onRequestModalClose,
            onMoveShouldSetPanResponder,
          }).panHandlers}
        >
          <View
            style={{
              width: 36,
              height: 5,
              marginTop: 6,
              backgroundColor: 'red',
              borderRadius: 2.5,
            }}
          />
        </View> */}

          {/* <Pressable>
          <View
            style={[
              {
                height: 100,
                width: '100%',
                backgroundColor: 'red',
                alignItems: 'center',
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                transform: [{ translateY: 15 }],
              },
            ]}
            {...useModalPanResponder({
              type: modalAnimationType,
              translateY,
              startShow,
              onRequestModalClose,
              onMoveShouldSetPanResponder,
            }).panHandlers}
          >
            <View
              style={{
                width: 36,
                height: 5,
                marginTop: 6,
                backgroundColor: 'red',
                borderRadius: 2.5,
              }}
            />
          </View>
        </Pressable> */}

          {/*
          // NOTE: https://github.com/facebook/react-native/issues/14295
          // Subcomponents need to be wrapped in `Pressable` to support sliding operations.
          // example: <Pressable>{children}</Pressable>
          // Note: Nested `FlatList` components are not supported, otherwise the list cannot be scrolled. It is recommended to use the `SimuModal` component.
         */}
          {children}
          {/* <Pressable>{children}</Pressable> */}
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const SlideComponent = (props: {
  Slide:
    | React.ComponentType<SlideProps>
    | ((props: SlideProps) => React.ReactElement);
  enableSlideComponent: boolean;
  modalAnimationType: ModalAnimationType;
  translateY: Animated.Value;
  startShow: (
    callback?: Parameters<Animated.CompositeAnimation['start']>[0]
  ) => void;
  startHide: (
    callback?: Parameters<Animated.CompositeAnimation['start']>[0]
  ) => void;
  onRequestModalClose: () => void;
  onMoveShouldSetPanResponder:
    | ((
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean)
    | undefined;
}) => {
  const {
    Slide,
    modalAnimationType,
    translateY,
    startShow,
    onRequestModalClose,
    onMoveShouldSetPanResponder,
    enableSlideComponent,
  } = props;
  const panHandlers = useModalPanResponder({
    type: modalAnimationType,
    translateY: translateY,
    startShow: startShow,
    onRequestModalClose: onRequestModalClose,
    onMoveShouldSetPanResponder: onMoveShouldSetPanResponder,
  }).panHandlers;

  return enableSlideComponent === true ? (
    <Slide modalType={'modal'} {...panHandlers} />
  ) : null;
};
