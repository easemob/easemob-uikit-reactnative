import * as React from 'react';
import { View } from 'react-native';

import { usePermissions } from '../rename.uikit';
import { default as Test } from './test_animated5_in_modal';

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
}
