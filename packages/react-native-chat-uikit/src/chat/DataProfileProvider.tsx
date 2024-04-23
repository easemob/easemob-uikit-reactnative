import * as React from 'react';
import type { EmitterSubscription } from 'react-native';

import {
  addEventListener,
  emitEvent,
  removeEventListener,
  removeEventListenerBySub,
  useEventEmitter,
} from '../dispatch';
import { gEventDataProfileProvider } from './const';
import type { DataModel, DataModelType } from './types';

/**
 * Data Profile Provider.
 */
export class DataProfileProvider {
  _dataList: Map<string, DataModel>;
  private _userProfile?:
    | ((data: Map<string, DataModel>) => Map<string, DataModel>)
    | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);
  private _groupProfile?:
    | ((data: Map<string, DataModel>) => Map<string, DataModel>)
    | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);
  constructor() {
    this._dataList = new Map();
  }

  /**
   * Convert data to map.
   * @param data
   * @returns
   */
  static toMap(data: DataModel[]): Map<string, DataModel> {
    const map = new Map<string, DataModel>();
    data.forEach((d) => {
      map.set(d.id, d);
    });
    return map;
  }

  /**
   * Convert map to array.
   */
  static toArray(data: Map<string, DataModel>): DataModel[] {
    const arr = [] as DataModel[];
    data.forEach((v) => {
      arr.push(v);
    });
    return arr;
  }

  /**
   * Register user profile.
   */
  registerUserProfile(
    h?:
      | ((data: Map<string, DataModel>) => Map<string, DataModel>)
      | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>)
  ): void {
    this._userProfile = h;
  }
  /**
   * Register group profile.
   */
  registerGroupProfile(
    h?:
      | ((data: Map<string, DataModel>) => Map<string, DataModel>)
      | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>)
  ): void {
    this._groupProfile = h;
  }
  /**
   * Clear data list.
   */
  clearDataList(): void {
    this._dataList.clear();
  }

  /**
   * Get a list of data.
   * @param list The data list. Typically comes from a component data source.
   * @returns List of cached data.
   */
  getDataList(list: DataModel[]): DataModel[] {
    const ret = [] as DataModel[];
    list.forEach((d) => {
      const data = this._dataList.get(d.id);
      if (data) {
        ret.push(data);
      } else {
        ret.push(d);
      }
    });
    return ret;
  }

  /**
   * Get data by id.
   */
  getDataById(id: string): DataModel | undefined {
    return this._dataList.get(id);
  }

  /**
   * Get a list of users.
   */
  getUserList(ids: string[]): DataModel[] {
    const ret = [] as DataModel[];
    ids.forEach((id) => {
      const data = this._dataList.get(id);
      if (data && data.type === 'user') {
        ret.push(data);
      } else {
        ret.push({ id, type: 'user' });
      }
    });
    return ret;
  }

  /**
   * Get a list of groups.
   */
  getGroupList(ids: string[]): DataModel[] {
    const ret = [] as DataModel[];
    ids.forEach((id) => {
      const data = this._dataList.get(id);
      if (data && data.type === 'group') {
        ret.push(data);
      } else {
        ret.push({ id, type: 'group' });
      }
    });
    return ret;
  }

  /**
   * Update the cache and notify interested components.
   *
   * Data that has been requested and received will no longer trigger notifications.
   *
   * @param dataList The default value can be obtained through the `getDataList` method.
   * @param isUpdateNotExisted Whether the non-existing data also needs to be updated. Default is false.
   * @param disableDispatch Whether to disable notification. Default is false.
   * @param dispatchHandler Callback for dispatching notifications. If false is returned, it is not distributed internally.
   */
  updateDataList(params: {
    dataList: Map<string, DataModel>;
    isUpdateNotExisted?: boolean;
    disableDispatch?: boolean;
    dispatchHandler?: (data: Map<string, DataModel>) => boolean;
  }): void {
    const {
      dataList,
      isUpdateNotExisted = false,
      disableDispatch = false,
      dispatchHandler,
    } = params;
    let needUpdate = false;
    const list = new Map<string, DataModel>();
    dataList.forEach((v, k) => {
      const isExisted = this._dataList.get(k);
      if (isExisted) {
        if (JSON.stringify(isExisted) !== JSON.stringify(v)) {
          const d = { ...isExisted, ...v } as DataModel;
          this._dataList.set(k, d);
          list.set(k, d);
          needUpdate = true;
        }
      } else {
        if (isUpdateNotExisted) {
          this._dataList.set(k, v);
          list.set(k, v);
          needUpdate = true;
        }
      }
    });
    if (needUpdate && disableDispatch !== true) {
      if (dispatchHandler) {
        if (dispatchHandler(list) === false) {
          return;
        }
      }
      this.dispatch(list);
    }
  }

  /**
   * Request updated data and notify interested components. The registered callback `registerUserProfile` and `registerGroupProfile` will be used to request data.
   *
   * Data that has been requested and received will no longer trigger notifications.
   *
   * @params dataList The data list to be updated.
   * - dataList: The data list to be updated.
   * - isUpdateNotExisted: Whether the non-existing data also needs to be updated. Default is false.
   * - disableDispatch: Whether to disable notification. Default is false.
   * - requestHasData: Whether to request data that already exists. Default is true.
   * - dispatchHandler: Callback for dispatching notifications. If false is returned, it is not distributed internally.
   */
  async requestDataList(params: {
    dataList: Map<string, DataModelType>;
    isUpdateNotExisted?: boolean;
    disableDispatch?: boolean;
    requestHasData?: boolean;
    dispatchHandler?: (data: Map<string, DataModel>) => boolean;
  }): Promise<void> {
    const {
      dataList,
      isUpdateNotExisted = false,
      disableDispatch = false,
      requestHasData = true,
      dispatchHandler,
    } = params;
    const newList = new Map<string, DataModel>();

    // user
    const users = Array.from(dataList.entries())
      .filter((v) => v[1] === 'user')
      .map((v) => v[0]!);
    const requestUsers = new Map<string, DataModel>();
    users.forEach((v) => {
      if (this._dataList.has(v)) {
        if (requestHasData === true) {
          requestUsers.set(v, this._dataList.get(v)!);
        }
      } else {
        requestUsers.set(v, { id: v, type: 'user' } as DataModel);
      }
    });
    if (this._userProfile) {
      const newUsers = await this._userProfile(requestUsers);
      users.forEach((v) => {
        if (newUsers.has(v)) {
          const data = newUsers.get(v);
          const newData = { id: v, type: data?.type } as DataModel;
          if (data?.avatar && data.avatar.length > 0) {
            newData.avatar = data.avatar;
          }
          if (data?.name && data.name.length > 0) {
            newData.name = data.name;
          }
          if (data?.remark && data.remark.length > 0) {
            newData.remark = data.remark;
          }
          newList.set(v, newData);
        }
      });
    }

    // group
    const groups = Array.from(dataList.entries())
      .filter((v) => v[1] === 'group')
      .map((v) => v[0]!);
    const requestGroups = new Map<string, DataModel>();
    groups.forEach((v) => {
      if (this._dataList.has(v)) {
        if (requestHasData === true) {
          requestGroups.set(v, this._dataList.get(v)!);
        }
      } else {
        requestGroups.set(v, { id: v, type: 'group' } as DataModel);
      }
    });
    if (this._groupProfile) {
      const newGroups = await this._groupProfile(requestGroups);
      groups.forEach((v) => {
        if (newGroups.has(v)) {
          const data = newGroups.get(v);
          const newData = { id: v, type: data?.type } as DataModel;
          if (data?.avatar && data.avatar.length > 0) {
            newData.avatar = data.avatar;
          }
          if (data?.name && data.name.length > 0) {
            newData.name = data.name;
          }
          if (data?.remark && data.remark.length > 0) {
            newData.remark = data.remark;
          }
          newList.set(v, newData);
        }
      });
    }

    this.updateDataList({
      dataList: newList,
      isUpdateNotExisted: isUpdateNotExisted,
      disableDispatch: disableDispatch,
      dispatchHandler: dispatchHandler,
    });
  }

  /**
   * Notify the component of interest.
   *
   * Follow notifications via `setObserver`.
   *
   * @param updateList Changed list.
   */
  dispatch(updateList: Map<string, DataModel>): void {
    emitEvent(gEventDataProfileProvider, updateList);
  }

  /**
   * Add an observer.
   */
  addObserver(
    observer: (updateList: Map<string, DataModel>) => void
  ): EmitterSubscription {
    return addEventListener(gEventDataProfileProvider, observer);
  }

  /**
   * Remove the observer by subscription.
   */
  removeObserver(sub: EmitterSubscription): void {
    removeEventListenerBySub(gEventDataProfileProvider, sub);
  }

  /**
   * Clear the observer.
   */
  clearObserver(): void {
    removeEventListener(gEventDataProfileProvider);
  }
}

export function useDataProfileProvider() {
  const { addEventListener, removeEventListenerBySub, emitEvent } =
    useEventEmitter();
  const _addListener = React.useCallback(
    (listener: (updateList: Map<string, DataModel>) => void) => {
      return addEventListener(gEventDataProfileProvider, listener);
    },
    [addEventListener]
  );
  const _removeListener = React.useCallback(
    (sub: EmitterSubscription) => {
      removeEventListenerBySub(gEventDataProfileProvider, sub);
    },
    [removeEventListenerBySub]
  );
  return {
    emitEvent,
    addDataProfileListener: _addListener,
    removeDataProfileListener: _removeListener,
  };
}
