import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform } from 'react-native';

import type { RootScreenParamsList } from '../routes';

export function useNavigationState(
  props: NativeStackScreenProps<RootScreenParamsList>
) {
  const { navigation } = props;

  // !!! Solve the problem of back button on android platform.
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      const state = navigation.getState();
      if (state.routes.length > 1) {
        const index = state.routes.length - 1;
        navigation.reset({
          ...state,
          index: index - 1,
          routes: state.routes.slice(1),
        });
      }
    }
  }, [navigation]);
}
