import * as React from 'react';

import { AsyncStorageBasic, SingletonObjects } from '../../rename.uikit';
import {
  appId,
  appKey,
  imPort,
  imServer,
  restServerDomain,
  useSandbox,
} from '../common/const';

export function useServerConfig() {
  const getKey = React.useCallback(
    async (key: string): Promise<string | undefined> => {
      const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
        appKey: `uikit/demo`,
      });
      try {
        const ret = await s.getData({ key: `${key}` });
        return ret.value;
      } catch (error) {
        console.warn('get error:', error);
        return undefined;
      }
    },
    []
  );
  const setKey = React.useCallback(async (key: string, value: string) => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `uikit/demo`,
    });
    try {
      await s.setData({ key: `${key}`, value: value });
    } catch (error) {
      console.warn('set error:', error);
    }
  }, []);

  const getAppKey = React.useCallback(async () => {
    return (await getKey('appKey')) ?? appKey;
  }, [getKey]);
  const getAppId = React.useCallback(async () => {
    return (await getKey('appId')) ?? appId;
  }, [getKey]);
  const getIsAppKey = React.useCallback(async () => {
    const isAppKey = await getKey('isAppKey');
    if (isAppKey === undefined) {
      return appKey && appKey.length > 0;
    } else {
      return isAppKey === 'true' ? true : isAppKey === 'false' ? false : false;
    }
  }, [getKey]);
  const getImServer = React.useCallback(async () => {
    return (await getKey('imServer')) ?? imServer;
  }, [getKey]);
  const getImPort = React.useCallback(async () => {
    return (await getKey('imPort')) ?? imPort;
  }, [getKey]);
  const getEnablePrivateServer = React.useCallback(async () => {
    const ret = await getKey(`enablePrivateServer`);
    return ret === 'true' ? true : ret === 'false' ? false : useSandbox;
  }, [getKey]);
  const getRestServerDomain = React.useCallback(async () => {
    return (await getKey('restServerDomain')) ?? restServerDomain;
  }, [getKey]);
  const getEnableDevMode = React.useCallback(async () => {
    const ret = await getKey(`enableDevMode`);
    return ret === 'true' ? true : ret === 'false' ? false : false;
  }, [getKey]);

  const setAppKey = React.useCallback(
    async (value: string) => {
      setKey('appKey', value);
    },
    [setKey]
  );
  const setAppId = React.useCallback(
    async (value: string) => {
      setKey('appId', value);
    },
    [setKey]
  );
  const setIsAppKey = React.useCallback(
    async (value: boolean) => {
      setKey(
        'isAppKey',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );
  const setImServer = React.useCallback(
    async (value: string) => {
      setKey('imServer', value);
    },
    [setKey]
  );
  const setImPort = React.useCallback(
    async (value: string) => {
      setKey('imPort', value);
    },
    [setKey]
  );
  const setEnablePrivateServer = React.useCallback(
    async (value: boolean) => {
      setKey(
        'enablePrivateServer',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );
  const setRestServerDomain = React.useCallback(
    async (value: string) => {
      setKey('restServerDomain', value);
    },
    [setKey]
  );
  const setEnableDevMode = React.useCallback(
    async (value: boolean) => {
      setKey(
        'enableDevMode',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );

  return {
    getAppKey,
    getAppId,
    getIsAppKey,
    getImServer,
    getImPort,
    getEnablePrivateServer,
    getRestServerDomain,
    getEnableDevMode,
    setAppKey,
    setAppId,
    setIsAppKey,
    setImServer,
    setImPort,
    setEnablePrivateServer,
    setRestServerDomain,
    setEnableDevMode,
  };
}

export class AppKey {
  static _appKey = appKey;
  static _appId = appId;
  static appKey() {
    return AppKey._appKey;
  }
  static appId() {
    return AppKey._appId;
  }
  static setAppKey(appKey: string) {
    AppKey._appKey = appKey;
  }
  static setAppId(appId: string) {
    AppKey._appId = appId;
  }
  static gAppKey() {
    return AppKey._appKey && AppKey._appKey.length > 0
      ? AppKey._appKey
      : AppKey._appId;
  }
}
