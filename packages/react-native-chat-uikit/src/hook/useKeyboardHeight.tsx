import * as React from 'react';
import { Keyboard, Platform } from 'react-native';

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

  return { keyboardHeight, keyboardCurrentHeight };
}
