import * as React from 'react';

import { AsyncStorageBasic, SingletonObjects } from '../../rename.uikit';
import {
  appKey as gAppKey,
  enableDNSConfig,
  imPort,
  imServer,
  restServer,
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
    return (await getKey('appKey')) ?? gAppKey;
  }, [getKey]);
  const getImServer = React.useCallback(async () => {
    return (await getKey('imServer')) ?? imServer;
  }, [getKey]);
  const getImPort = React.useCallback(async () => {
    return (await getKey('imPort')) ?? imPort;
  }, [getKey]);
  const getEnableDNSConfig = React.useCallback(async () => {
    const ret = await getKey(`enablePrivateServer`);
    return ret === 'true' ? true : ret === 'false' ? false : enableDNSConfig;
  }, [getKey]);
  const getRestSever = React.useCallback(async () => {
    return (await getKey('restServer')) ?? restServer;
  }, [getKey]);

  const setAppKey = React.useCallback(
    async (value: string) => {
      setKey('appKey', value);
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
  const setEnableDNSConfig = React.useCallback(
    async (value: boolean) => {
      setKey(
        'enablePrivateServer',
        value === true ? 'true' : value === false ? 'false' : 'false'
      );
    },
    [setKey]
  );
  const setRestSever = React.useCallback(
    async (value: string) => {
      setKey('restServer', value);
    },
    [setKey]
  );

  return {
    getAppKey,
    getImServer,
    getImPort,
    getEnableDNSConfig,
    getRestSever,
    setAppKey,
    setImServer,
    setImPort,
    setEnableDNSConfig,
    setRestSever,
  };
}
