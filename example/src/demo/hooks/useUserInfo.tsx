import * as React from 'react';
import {
  SingletonObjects,
  UserData,
  UserStorage,
} from 'react-native-chat-uikit';

import { appKey as gAppKey } from '../common/const';

export function useUserInfo() {
  const list = React.useRef<Map<string, UserData>>(new Map());
  const storage = SingletonObjects.getInstanceWithParams(UserStorage, {
    appKey: gAppKey,
  });
  const arrayToList = React.useCallback((users: UserData[]) => {
    const list = new Map<string, UserData>();
    users.forEach((item) => {
      list.set(item.userId, item);
    });
    return list;
  }, []);
  const listToArray = React.useCallback((list: Map<string, UserData>) => {
    return Array.from(list.values());
  }, []);
  const resetData = React.useCallback(() => {
    list.current.clear();
  }, []);
  const getDataFromStorage = React.useCallback(
    async (userId: string) => {
      resetData();
      storage.setCurrentId(userId);
      const ret = await storage.getAllUser();
      arrayToList(ret).forEach((value, key) => {
        list.current.set(key, value);
      });
    },
    [arrayToList, resetData, storage]
  );
  const updateDataToStorage = React.useCallback(() => {
    storage.setAllUser(listToArray(list.current));
  }, [listToArray, storage]);

  const updateDataFromServer = React.useCallback((users: UserData[]) => {
    for (const user of users) {
      const isExisted = list.current.get(user.userId);
      if (isExisted) {
        list.current.set(user.userId, {
          ...isExisted,
          ...user,
          timestamp: Date.now(),
        });
      } else {
        list.current.set(user.userId, { ...user, timestamp: Date.now() });
      }
    }
  }, []);
  const clearOldData = React.useCallback(() => {
    const now = Date.now();
    const keysToDelete = [] as string[];
    list.current.forEach((value, key) => {
      if (value.timestamp && now - value.timestamp > 1000 * 60 * 60 * 24 * 7) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => {
      list.current.delete(key);
    });
  }, []);

  return {
    list,
    getDataFromStorage,
    updateDataToStorage,
    updateDataFromServer,
    resetData,
    clearOldData,
  };
}
