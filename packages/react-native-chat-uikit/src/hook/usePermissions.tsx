import * as React from 'react';
import { Platform } from 'react-native';

import {
  checkCameraPermission,
  checkRecordPermission,
  checkStoragePermission,
  requestCameraPermission,
  requestRecordPermission,
  requestStoragePermission,
} from '../utils';

export function usePermissions() {
  const checkAndRequestPermissions = React.useCallback(
    async (params: { onResult: (isSuccess: boolean) => void }) => {
      const { onResult } = params;
      if (Platform.OS === 'ios') {
        onResult(true);
      } else if (Platform.OS === 'android') {
        let ret = await checkRecordPermission();
        if (ret !== true) {
          ret = await requestRecordPermission();
          if (ret !== true) {
            onResult(false);
            return;
          }
        }
        ret = await checkCameraPermission();
        if (ret !== true) {
          ret = await requestCameraPermission();
          if (ret !== true) {
            onResult(false);
            return;
          }
        }
        ret = await checkStoragePermission();
        if (ret !== true) {
          ret = await requestStoragePermission();
          if (ret !== true) {
            onResult(false);
            return;
          }
        }
        onResult(true);
      } else {
        onResult(false);
      }
    },
    []
  );
  return {
    getPermission: checkAndRequestPermissions,
  };
}
