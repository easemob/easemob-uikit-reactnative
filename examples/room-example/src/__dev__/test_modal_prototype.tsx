import * as React from 'react';
import {
  Animated,
  ColorValue,
  Modal as RNModal,
  ModalProps as RNModalProps,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

type ModalAnimationType = 'none' | 'slide' | 'fade' | undefined;

type ModalProps = Omit<
  RNModalProps,
  | 'animated'
  | 'animationType'
  | 'transparent'
  | 'visible'
  | 'style'
  | 'onRequestClose'
> & {
  modalVisible: boolean;
  onRequestModalClose: () => void;
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
};

export function Modal(props: ModalProps) {
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
  console.log('test:Modal:');
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  const [visible, setVisible] = React.useState(modalVisible);

  React.useEffect(() => {
    if (modalVisible === false) {
      // !!! There are still problems with this implementation and it needs to be refreshed three times. There is no native callback for hidden components. This may not be possible.
      startHide(() => setVisible(modalVisible));
    } else {
      setVisible(modalVisible);
    }
  }, [startHide, modalVisible]);

  return (
    <RNModal
      transparent={true}
      visible={visible}
      onShow={() => {
        startShow();
      }}
      onDismiss={() => {
        startHide();
      }}
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
        }).panHandlers}
      >
        {children}
      </Animated.View>
    </RNModal>
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
  onRequestModalClose: () => void;
}): PanResponderInstance => {
  const { type, translateY, onRequestModalClose, startShow } = params;
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
        if (isHideGesture(dy, vy)) onRequestModalClose();
        else startShow();
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
      <Modal
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
      </Modal>
    </View>
  );
}

export default function test_modal_prototype() {
  return <TestModalPrototype />;
}
