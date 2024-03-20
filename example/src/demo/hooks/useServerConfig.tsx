import * as React from 'react';
import { AsyncStorageBasic, SingletonObjects } from 'react-native-chat-uikit';

import {
  appKey as gAppKey,
  enableDNSConfig,
  imPort,
  imServer,
  useSendBox,
} from '../common/const';

export function useServerConfig() {
  const getImServer = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    try {
      const ret = await s.getData({ key: 'imServer' });
      if (ret.value === undefined) {
        return imServer;
      }
      return ret.value;
    } catch (error) {
      return undefined;
    }
  }, []);
  const getImPort = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    try {
      const ret = await s.getData({ key: 'imPort' });
      if (ret.value === undefined) {
        return imPort;
      }
      if (ret.value) {
        return ret.value;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }, []);
  const getEnableDNSConfig = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    try {
      const ret = await s.getData({ key: 'enablePrivateServer' });
      if (ret.value === undefined) {
        return enableDNSConfig;
      }
      return ret.value === 'true'
        ? true
        : ret.value === 'false'
        ? false
        : (useSendBox as boolean);
    } catch (error) {
      return false;
    }
  }, []);
  return {
    getImServer,
    getImPort,
    getEnableDNSConfig,
  };
}
