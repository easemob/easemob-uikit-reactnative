import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ConversationModel, UserData } from '../chat';

export class AsyncStorageBasic {
  prefix: string;
  useId: string | undefined;
  constructor(params: { appKey: string }) {
    this.prefix = `@${params.appKey}`;
  }
  destructor() {}
  setCurrentId(useId: string): void {
    this.useId = useId;
  }
  async setData(params: {
    key: string;
    value: string;
  }): Promise<{ isOk: boolean; error?: any }> {
    try {
      await AsyncStorage.setItem(params.key, params.value);
      return { isOk: true };
    } catch (error) {
      return { isOk: false, error };
    }
  }
  async setDataWithPrefix(params: {
    key: string;
    value: string;
  }): Promise<{ isOk: boolean; error?: any }> {
    return this.setData({
      key: `${this.prefix}/${params.key}`,
      value: params.value,
    });
  }
  async setDataWithUser(params: {
    key: string;
    value: string;
  }): Promise<{ isOk: boolean; error?: any }> {
    return this.setData({
      key: `${this.prefix}/${this.useId}/${params.key}`,
      value: params.value,
    });
  }
  async getData(params: {
    key: string;
  }): Promise<{ value?: string; error?: any }> {
    try {
      const value = await AsyncStorage.getItem(params.key);
      return { value: value === null ? undefined : value };
    } catch (error) {
      return { error };
    }
  }
  async getDataWithPrefix(params: {
    key: string;
  }): Promise<{ value?: string; error?: any }> {
    return this.getData({
      key: `${this.prefix}/${params.key}`,
    });
  }
  async getDataWithUser(params: {
    key: string;
  }): Promise<{ value?: string; error?: any }> {
    return this.getData({
      key: `${this.prefix}/${this.useId}/${params.key}`,
    });
  }
}

export class ConversationStorage extends AsyncStorageBasic {
  constructor(params: { appKey: string }) {
    super(params);
  }
  destructor() {
    super.destructor();
  }
  async isFinishedForFetchList(): Promise<boolean | undefined> {
    const ret = await this.getData({
      key: `${this.prefix}/${this.useId}/conv/isFinished`,
    });
    return ret ? ret.value === 'true' : undefined;
  }
  async setFinishedForFetchList(isFinished: boolean): Promise<boolean> {
    const ret = await this.setData({
      key: `${this.prefix}/${this.useId}/conv/isFinished`,
      value: isFinished.toString(),
    });
    return ret.isOk;
  }
  async isFinishedForDoNotDisturb(): Promise<boolean | undefined> {
    const ret = await this.getData({
      key: `${this.prefix}/${this.useId}/conv/doNotDisturb`,
    });
    return ret ? ret.value === 'true' : undefined;
  }
  async setFinishedForDoNotDisturb(isFinished: boolean): Promise<boolean> {
    const ret = await this.setData({
      key: `${this.prefix}/${this.useId}/conv/doNotDisturb`,
      value: isFinished.toString(),
    });
    return ret.isOk;
  }
  async setAllConversation(list: ConversationModel[]): Promise<boolean> {
    const data = list.map((item) => {
      return {
        id: item.convId,
        doNotDisturb: item.doNotDisturb,
      };
    });
    const ret = await this.setData({
      key: `${this.prefix}/${this.useId}/conv/allConversation`,
      value: JSON.stringify(data),
    });
    return ret.isOk;
  }
  async getAllConversation(): Promise<ConversationModel[]> {
    const ret = await this.getData({
      key: `${this.prefix}/${this.useId}/conv/allConversation`,
    });
    if (ret.value) {
      const data = JSON.parse(ret.value);
      return data.map((item: any) => {
        return {
          convId: item.id,
          doNotDisturb: item.doNotDisturb,
        };
      });
    }
    return [];
  }
}
export class UserStorage extends AsyncStorageBasic {
  constructor(params: { appKey: string }) {
    super(params);
  }
  destructor() {
    super.destructor();
  }
  async setAllUser(list: UserData[]): Promise<boolean> {
    const data = list.map((item) => {
      return {
        id: item.userId,
        name: item.userName,
        avatar: item.avatarURL,
        timestamp: item.timestamp ?? Date.now(),
      };
    });
    const ret = await this.setData({
      key: `${this.prefix}/${this.useId}/user/allUser`,
      value: JSON.stringify(data),
    });
    return ret.isOk;
  }
  async getAllUser(): Promise<UserData[]> {
    const ret = await this.getData({
      key: `${this.prefix}/${this.useId}/user/allUser`,
    });
    if (ret.value) {
      const data = JSON.parse(ret.value);
      return data.map((item: any) => {
        return {
          userId: item.id,
          userName: item.name,
          avatarURL: item.avatar,
          timestamp: item.timestamp,
        } as UserData;
      });
    }
    return [];
  }
}
