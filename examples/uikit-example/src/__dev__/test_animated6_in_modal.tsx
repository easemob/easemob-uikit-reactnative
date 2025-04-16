// https://github.com/hakymz/ReactNativeCustomModal/blob/main/App.js
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Container, ConversationList } from '../rename.uikit';

const App = () => {
  return (
    <Container options={{ appKey: 'sdf', autoLogin: false, debugModel: true }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ConversationList />
      </GestureHandlerRootView>
    </Container>
  );
};

export default App;

/**
 * React.StrictMode
 * newArchEnabled
 * Animated.timing
 * Modal children
 */
