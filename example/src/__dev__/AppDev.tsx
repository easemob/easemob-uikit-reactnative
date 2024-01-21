import * as React from 'react';
import { View } from 'react-native';
import { usePermissions } from 'react-native-chat-uikit';

// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { default as Test } from './test_image_preview';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export function AppDev(): JSX.Element {
  const permissionsRef = React.useRef(false);
  usePermissions({
    onResult: (isSuccess) => {
      console.log('dev:permissions:', isSuccess);
      permissionsRef.current = isSuccess;
    },
  });
  return (
    <View style={{ flex: 1 }}>
      <Test />
    </View>
  );
  // return (
  //   <View style={{ flex: 1 }}>
  //     <GestureHandlerRootView>
  //       <Test />
  //     </GestureHandlerRootView>
  //   </View>
  // );
  // return (
  //   <React.StrictMode>
  //     <View style={{ flex: 1 }}>
  //       <Test />
  //     </View>
  //   </React.StrictMode>
  // );
}
