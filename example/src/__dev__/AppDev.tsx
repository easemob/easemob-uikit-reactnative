import * as React from 'react';
import { View } from 'react-native';
import { usePermissions } from 'react-native-chat-uikit';

// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { default as Test } from './test_image_mask';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export function AppDev(): JSX.Element {
  const permissionsRef = React.useRef(false);
  const { getPermission } = usePermissions();
  React.useEffect(() => {
    getPermission({
      onResult: (isSuccess: boolean) => {
        console.log('dev:permissions:', isSuccess);
        permissionsRef.current = isSuccess;
      },
    });
  }, [getPermission]);
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
