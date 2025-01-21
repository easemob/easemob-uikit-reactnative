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

type SimulativeModalRef = {
  startShow: () => void;
  startHide: () => void;
};

type SimulativeModalProps = Omit<ViewProps, 'style'> & {
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
  propsRef: React.RefObject<SimulativeModalRef>;
};

export function SimulativeModal(props: SimulativeModalProps) {
  const {
    modalAnimationType,
    modalStyle,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = true,
    children,
    propsRef,
    ...others
  } = props;
  console.log('test:SimulativeModal:');
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  const { width, height } = useWindowDimensions();
  const [modalVisible, setModalVisible] = React.useState(false);

  if (propsRef) {
    if (propsRef.current) {
      propsRef.current.startShow = () => {
        setModalVisible(true);
        startShow();
      };
      propsRef.current.startHide = () => {
        startHide(() => setModalVisible(false));
      };
    }
  }

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
            startHide(() => setModalVisible(false));
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
          setModalVisible,
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
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}): PanResponderInstance => {
  const { type, translateY, setModalVisible, startHide, startShow } = params;
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
          startHide(() => setModalVisible(false));
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
  const ref = React.useRef<SimulativeModalRef>({} as any);
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
          ref.current.startShow();
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <SimulativeModal
        propsRef={ref}
        modalAnimationType="slide"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
      >
        <Pressable
          style={{ height: 400, backgroundColor: 'yellow' }}
          onPress={() => {
            ref.current.startHide();
          }}
        />
      </SimulativeModal>
    </View>
  );
}

export default function test_modal_prototype() {
  return <TestModalPrototype />;
}
