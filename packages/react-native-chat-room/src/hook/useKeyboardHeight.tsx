import * as React from 'react';
import { Keyboard, NativeModules, Platform } from 'react-native';

type ChatRoomEnvironmentModuleType = {
  sdkInt?: number;
  edgeToEdgeEnabled?: boolean | null;
};

const androidEnvironment: ChatRoomEnvironmentModuleType | undefined =
  Platform.OS === 'android'
    ? (NativeModules.ChatRoomEnvironment as
        | ChatRoomEnvironmentModuleType
        | undefined)
    : undefined;

const androidSdkInt =
  typeof androidEnvironment?.sdkInt === 'number'
    ? androidEnvironment.sdkInt
    : undefined;
const androidEdgeToEdgeEnabled =
  typeof androidEnvironment?.edgeToEdgeEnabled === 'boolean'
    ? androidEnvironment.edgeToEdgeEnabled
    : undefined;

const shouldCompensateAndroidKeyboard =
  androidSdkInt === undefined ||
  androidSdkInt >= 35 ||
  androidEdgeToEdgeEnabled !== false;

/**
 * Get the keyboard height. Need to be obtained dynamically.
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [keyboardCurrentHeight, setKeyboardCurrentHeight] = React.useState(0);

  React.useEffect(() => {
    const showSubscriptionI = Keyboard.addListener('keyboardWillShow', (e) => {
      if (Platform.OS === 'ios') {
        setKeyboardHeight(e.endCoordinates.height);
      }
    });
    const hideSubscriptionI = Keyboard.addListener('keyboardWillHide', () => {
      if (Platform.OS === 'ios') {
      }
    });
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      if (Platform.OS === 'android') {
        setKeyboardHeight(e.endCoordinates.height);
      }
      setKeyboardCurrentHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardCurrentHeight(0);
    });

    return () => {
      showSubscriptionI.remove();
      hideSubscriptionI.remove();
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const keyboardCompensationHeight = React.useMemo(() => {
    if (Platform.OS === 'android') {
      if (shouldCompensateAndroidKeyboard === false) {
        return 0;
      }
      return Math.max(keyboardCurrentHeight, 0);
    }
    return Math.max(keyboardCurrentHeight, 0);
  }, [keyboardCurrentHeight]);

  return {
    keyboardHeight,
    keyboardCurrentHeight,
    keyboardCompensationHeight,
    shouldCompensateKeyboard:
      Platform.OS === 'android' ? shouldCompensateAndroidKeyboard : true,
  };
}
