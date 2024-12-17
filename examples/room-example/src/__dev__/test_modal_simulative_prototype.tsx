import * as React from 'react';
import {
  Animated,
  ColorValue,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

type ModalAnimationType = 'none' | 'slide' | 'fade' | undefined;

type SimulativeModalProps = Omit<ViewProps, 'style'> & {
  modalVisible: boolean;
  onRequestModalClose: () => void;
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
};

export function SimulativeModal(props: SimulativeModalProps) {
  const {
    modalAnimationType,
    modalStyle,
    modalVisible,
    onRequestModalClose,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = true,
    children,
    ...others
  } = props;
  console.log('test:SimulativeModal:');
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  // const [visible, setVisible] = React.useState(modalVisible);
  const { width, height } = useWindowDimensions();

  React.useEffect(() => {
    if (modalVisible === false) {
      // startHide(() => setVisible(modalVisible));
      // startHide();
    } else {
      // startShow(() => setTimeout(() => setVisible(modalVisible), 1000));
      startShow();
      // startShow(() => setVisible(modalVisible));
    }
  }, [startHide, modalVisible, startShow]);

  // return (
  //   <Animated.View
  //     style={{
  //       flex: 1,
  //       position: 'absolute',
  //       width: width,
  //       height: height,
  //       backgroundColor: 'red',
  //       display: modalVisible === true ? 'flex' : 'none',
  //       opacity: modalVisible === true ? backgroundOpacity : 0,
  //     }}
  //     onLayout={(e) => {
  //       console.log('test:onLayout:', e.nativeEvent.layout);
  //     }}
  //     onTouchEnd={() => {
  //       console.log('test:zuoyu');
  //       startHide(() => {
  //         onRequestModalClose();
  //       });
  //     }}
  //   />
  // );

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        width: width,
        height: height,
        // backgroundColor: 'red',
        display: modalVisible === true ? 'flex' : 'none',
        // opacity: modalVisible === true ? 1 : 0,
      }}
      onLayout={(e) => {
        console.log('test:onLayout:', e.nativeEvent.layout);
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (disableBackgroundClose !== true) {
            startHide(() => {
              onRequestModalClose();
            });
          }
        }}
        onLayout={(e) => {
          console.log(
            'test:TouchableWithoutFeedback:onLayout:',
            e.nativeEvent.layout
          );
        }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                backgroundTransparent === true ? undefined : backgroundColor,
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
            // backgroundColor: 'red',
          },
          modalStyle,
        ]}
        pointerEvents="box-none"
        {...useModalPanResponder({
          type: modalAnimationType,
          translateY,
          startShow,
          startHide,
          onRequestModalClose,
        }).panHandlers}
        {...others}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const useModalAnimation = (type: ModalAnimationType) => {
  const { height } = useWindowDimensions();
  const initialY = type === 'slide' ? height : 0;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(initialY)).current;
  // translateY.setValue(initialY);

  const createAnimated = (toValue: 0 | 1) => {
    const config = { duration: 250, useNativeDriver: false };
    return Animated.parallel([
      Animated.timing(backgroundOpacity, { toValue, ...config }),
      Animated.timing(translateY, {
        toValue: toValue === 0 ? initialY : 0,
        ...config,
      }),
    ]).start;
  };

  return {
    translateY,
    backgroundOpacity,
    startShow: createAnimated(1),
    startHide: createAnimated(0),
  };
};

const useModalPanResponder = (params: {
  type: ModalAnimationType;
  translateY: Animated.Value;
  startShow: (callback?: Animated.EndCallback | undefined) => void;
  startHide: (callback?: Animated.EndCallback | undefined) => void;
  onRequestModalClose: () => void;
}): PanResponderInstance => {
  const { type, translateY, onRequestModalClose, startHide, startShow } =
    params;
  const isHideGesture = React.useCallback(
    (distanceY: number, velocityY: number) => {
      return distanceY > 125 || (distanceY > 0 && velocityY > 0.1);
    },
    []
  );
  const r = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy }) => {
        return dy > 8;
      },
      onPanResponderGrant: (_, __) => {
        // @ts-ignore
        translateY.setOffset(translateY.__getValue());
      },
      onPanResponderMove: (_, { dy }) => {
        return dy >= 0 && translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isHideGesture(dy, vy)) {
          startHide(() => onRequestModalClose());
        } else {
          startShow();
        }
      },
    })
  ).current;
  if (type === 'slide') return r;
  else return { panHandlers: {} };
};

export function TestModalPrototype(): JSX.Element {
  console.log('test:TestModalPrototype');
  const [visible, setVisible] = React.useState(false);
  const { width } = useWindowDimensions();
  return (
    <View
      style={{ flex: 1, paddingTop: 100 }}
      onLayout={(e) => {
        console.log('test:onLayout:', e.nativeEvent.layout);
      }}
    >
      <Pressable
        onPress={() => {
          setVisible(!visible);
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <SimulativeModal
        modalAnimationType="slide"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
        modalVisible={visible}
        onRequestModalClose={() => {
          setVisible(false);
        }}
      >
        <Pressable
          style={{ height: 400, backgroundColor: 'yellow' }}
          onPress={() => {
            setVisible(false);
          }}
        />
      </SimulativeModal>
    </View>
  );
}

export default function test_modal_prototype() {
  return <TestModalPrototype />;
}
