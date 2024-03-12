import './utils/globals';

// import { registerRootComponent } from 'expo';
import * as React from 'react';
import { View } from 'react-native';

// let fcmToken = '';
// if (fcmSenderId && fcmSenderId.length > 0) {
//   fcmToken = await requestFcmToken();
// }

export default function App() {
  return <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
