// https://github.com/hakymz/ReactNativeCustomModal/blob/main/App.js
import React from 'react';
import {
  Animated,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';

export type SlideModalProps = any;
function SlideModal(props: SlideModalProps) {
  const {
    propsRef,
    modalAnimationType,
    modalStyle,
    onRequestModalClose,
    disableBackgroundClose = false,
    backgroundTransparent = false,
    onFinished,
    keyboardVerticalOffset,
    enabledKeyboardAdjust = false,
    ...others
  } = props;
  const { height } = useWindowDimensions();
  const initialY = modalAnimationType === 'slide' ? height : 0;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(initialY)).current;
  const [visible, setVisible] = React.useState(false);

  const startShow = React.useCallback(
    (cb?: () => void) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        cb?.();
      });
    },
    [translateY]
  );

  const startHide = React.useCallback(
    (cb?: () => void) => {
      Animated.timing(translateY, {
        toValue: initialY,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        cb?.();
      });
    },
    [translateY, initialY]
  );

  if (propsRef.current) {
    propsRef.current.startShow = (onf?: () => void, timeout?: number) => {
      setVisible(true);
      if (timeout !== undefined) {
        startShow(() => {
          onf?.();
        });
      } else {
        startShow(() => {
          onf?.();
        });
      }
    };
    propsRef.current.startHide = (onf?: () => void, timeout?: number) => {
      if (timeout !== undefined) {
        startHide(() => {
          setVisible(false);
          onf?.();
          onFinished?.();
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
  console.log(
    'test:zuoyu:visible',
    visible,
    modalAnimationType,
    backgroundTransparent,
    backgroundOpacity,
    translateY
  );
  // return (
  //   <Animated.View
  //     style={[
  //       {
  //         // display: visible ? 'flex' : 'none',
  //         // flex: 1,
  //         justifyContent: 'flex-end',
  //         opacity: modalAnimationType === 'fade' ? backgroundOpacity : 1,
  //         transform: [{ translateY: translateY }],
  //       },
  //       modalStyle,
  //     ]}
  //     pointerEvents={'box-none'}
  //   >
  //     <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />
  //   </Animated.View>
  // );

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
          style={[StyleSheet.absoluteFill, styles.modalBackGround]}
        />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        pointerEvents={'box-none'}
        enabled={enabledKeyboardAdjust}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            {
              // display: visible ? 'flex' : 'none',
              // flex: 1,
              justifyContent: 'flex-end',
              // opacity: modalAnimationType === 'fade' ? backgroundOpacity : 1,
              transform: [{ translateY: translateY }],
            },
            modalStyle,
          ]}
          pointerEvents={'box-none'}
        >
          <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
const App = () => {
  const propsRef = React.useRef<SlideModalProps>({});
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SlideModal
        propsRef={propsRef}
        modalAnimationType="slide"
        onRequestModalClose={() => propsRef.current?.startHide()}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => propsRef.current?.startHide()}>
              <Image
                source={require('../../assets/agora_about_logo.png')}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/agora_logo_2x.png')}
            style={{ height: 150, width: 150, marginVertical: 10 }}
          />
        </View>

        <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center' }}>
          Congratulations registration was successful
        </Text>
      </SlideModal>
      <Button
        title="Open Modal"
        onPress={() => propsRef.current?.startShow()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default App;
