import AsyncStorage from '@react-native-async-storage/async-storage';

import { gAvatarUrlBasic, gUserAvatars, gUserNickName2 } from '../const';
import { ChatRoom, Keyof } from '../rename.room';
import { randomId, randomItem } from '../utils/utils';

export type UserData = {
  userId: string;
  nickname: string;
  avatar: string;
};

export class UserDataManager {
  static async _storeData(params: {
    key: string;
    value: string;
    onResult: (params: { isOk: boolean; error?: any }) => void;
  }): Promise<void> {
    try {
      await AsyncStorage.setItem(params.key, params.value, (error) => {
        if (error) {
          params.onResult({ isOk: false, error });
        } else {
          params.onResult({ isOk: true });
        }
      });
    } catch (error) {
      params.onResult({ isOk: false, error });
    }
  }

  static async _getData(params: {
    key: string;
    onResult: (params: { value?: string; error?: any }) => void;
  }): Promise<void> {
    try {
      const value = await AsyncStorage.getItem(params.key, (error) => {
        if (error) {
          params.onResult({ error });
        }
      });
      params.onResult({ value: value === null ? undefined : value });
    } catch (error) {
      params.onResult({ error });
    }
  }

  static async _getAllKeys(params: {
    onResult: (params: { value?: string[]; error?: any }) => void;
  }): Promise<void> {
    try {
      const value = await AsyncStorage.getAllKeys((error) => {
        if (error) {
          params.onResult({ error });
        }
      });
      params.onResult({ value: [...value] });
    } catch (error) {
      params.onResult({ error });
    }
  }

  static createUser(userId: string): UserData {
    return {
      userId: userId,
      nickname: randomItem(gUserNickName2),
      avatar: `${gAvatarUrlBasic}${randomItem(gUserAvatars)}`,
    };
  }

  static getCurrentUserByUserId(
    userId: string,
    autoCreate: boolean,
    onResult: (params: { user?: UserData }) => void
  ) {
    UserDataManager._getData({
      key: userId,
      onResult: (params) => {
        if (params.value) {
          const user = JSON.parse(params.value) as UserData;
          onResult({ user });
        } else {
          if (autoCreate === true) {
            const user = UserDataManager.createUser(userId);
            this.setCurrentUser(user, onResult);
          } else {
            onResult({});
          }
        }
      },
    });
  }

  static setCurrentUser(
    user: UserData,
    onResult: (params: { user?: UserData }) => void
  ) {
    UserDataManager._storeData({
      key: user.userId,
      value: JSON.stringify(user),
      onResult: (params) => {
        if (params.isOk) {
          onResult({ user });
        } else {
          onResult({});
        }
      },
    });
  }

  static getCurrentUser(
    autoCreate: boolean,
    onResult: (params: { user?: UserData }) => void
  ) {
    UserDataManager._getAllKeys({
      onResult: (params) => {
        if (params.error) {
          onResult({});
        } else {
          if (params.value && params.value.length > 0) {
            const userId = params.value[0]!;
            UserDataManager.getCurrentUserByUserId(
              userId,
              autoCreate,
              onResult
            );
          } else {
            const userId = randomId();
            UserDataManager.getCurrentUserByUserId(
              userId,
              autoCreate,
              onResult
            );
          }
        }
      },
    });
  }
}
type ChatRoomType = { [p in Keyof<ChatRoom>]: ChatRoom[p] };
export interface RoomData extends ChatRoomType {
  ownerAvatar: string;
  ownerNickName: string;
  // videoUrl?: string;
  // videType: 'agora_promotion_live' | 'live';
  // affiliations_count: number;
  // persistent: boolean;
}
