import { Platform } from 'react-native';

import { getFileExtension } from '../../rename.uikit';
import { accountType } from './const';

export type RequestResult<Value, Error = any> = {
  isOk: boolean;
  value?: Value | undefined;
  error?: Error | undefined;
};

export type EasemobRequestLoginResult = {
  chatUserName: string;
  code: number;
  phoneNumber: string;
  token: string;
  avatarUrl?: string;
  errorInfo?: any;
};
export type AgoraRequestLoginResult = {
  chatUserName: string;
  code: number;
  agoraUid: string;
  accessToken: string;
  expireTimestamp: number;
  avatarUrl?: string;
  errorInfo?: any;
};
export type RequestLoginResult = (
  | EasemobRequestLoginResult
  | AgoraRequestLoginResult
) & {
  accountType: string;
};
export type RequestUploadAvatarResult = {
  code: number;
  avatarUrl: string;
};
export type RequestRtcTokenResult = {
  code: number;
  accessToken: string;
  expireTimestamp: number;
  agoraUid: string;
};
export type RequestRtcMapResult = {
  code: number;
  channelName: string;
  result: Record<string, string>;
};
export type RequestGroupAvatarResult = {
  code: number;
  avatarUrl: string;
};
export type RequestDestroyAccountResult = {
  code: number;
};
export type RequestGetUserByPhoneResult = {
  chatUserName: string;
  code: number;
};

export class RestApi {
  private static _protocol: string = 'http://';
  private static _server: string = 'localhost:8096';
  private static _basicUrl: string =
    accountType === 'agora' ? '/app/chat' : '/inside/app';
  private static _rtcTokenUrl: string =
    accountType === 'agora'
      ? '/app/chat/token/rtc/channel'
      : '/inside/token/rtc/channel';
  private static _rtcMapUrl: string =
    accountType === 'agora'
      ? '/app/chat/agora/channel/mapper'
      : '/inside/agora/channel/mapper';

  private static isOk(value: any) {
    return value.code === 200 || value.code === 'RES_OK' ? true : false;
  }

  private static code(value: any) {
    return typeof value.code === 'string'
      ? value.code === 'RES_OK'
        ? 200
        : 999
      : value.code ?? 999;
  }

  public static setProtocol(protocol: string) {
    this._protocol = protocol;
  }
  public static setServer(server: string) {
    console.log('dev:setServer:', server);
    this._server = server;
  }
  public static setBasicUrl(basicUrl: string) {
    console.log('dev:setBasicUrl:', basicUrl);
    this._basicUrl = basicUrl;
  }
  public static getBasicUrl() {
    return this._protocol + this._server + this._basicUrl;
  }

  public static getRtcTokenUrl() {
    return this._protocol + this._server + this._rtcTokenUrl;
  }

  public static getRtcMapUrl() {
    return this._protocol + this._server + this._rtcMapUrl;
  }

  public static set rtcTokenUrl(url: string) {
    RestApi._rtcTokenUrl = url;
  }

  public static set rtcMapUrl(url: string) {
    RestApi._rtcMapUrl = url;
  }

  public static get protocol() {
    return RestApi._protocol;
  }

  public static get server() {
    return RestApi._server;
  }

  public static get basicUrl() {
    return RestApi._basicUrl;
  }

  public static get rtcTokenUrl() {
    return RestApi._rtcTokenUrl;
  }

  public static get rtcMapUrl() {
    return RestApi._rtcMapUrl;
  }

  /**
   * Request a SMS code.
   */
  public static async requestSmsCode(params: { phone: string }): Promise<any> {
    const { phone } = params;
    const url = this.getBasicUrl() + `/sms/send/${phone}`;
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log('RestApi:requestSmsCode:', url, params);
    } catch (error) {
      console.warn('RestApi:requestSmsCode:error:', error);
    }
  }

  /**
   * Request login.
   */
  public static async requestLogin(params: {
    phone: string;
    code: string;
  }): Promise<RequestResult<RequestLoginResult>> {
    const { phone, code } = params;
    const url = this.getBasicUrl() + `/user/login/V2`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone, smsCode: code }),
      });
      const value = await response.json();
      console.log('RestApi:requestLogin:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: { ...value, accountType, code: RestApi.code(value) },
      };
    } catch (error) {
      console.warn('RestApi:requestLogin:error:', error);
      return { isOk: false, error };
    }
  }

  public static async requestAgoraLogin(params: {
    userId: string;
    password: string;
  }): Promise<RequestResult<RequestLoginResult>> {
    const { userId, password } = params;
    const url = this.getBasicUrl() + `/user/login`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAccount: userId, userPassword: password }),
      });
      const value = await response.json();
      console.log('RestApi:requestAgoraLogin:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: {
          ...value,
          accountType,
          code: RestApi.code(value),
        },
      };
    } catch (error) {
      console.warn('RestApi:requestAgoraLogin:error:', error);
      return { isOk: false, error };
    }
  }

  /**
   * Request upload avatar.
   */
  public static async requestUploadAvatar(params: {
    userId: string;
    localAvatarFile: string;
    fileType?: string;
  }): Promise<RequestResult<RequestUploadAvatarResult>> {
    const { userId, localAvatarFile, fileType } = params;
    const url = this.getBasicUrl() + `/user/${userId}/avatar/upload`;
    console.log('RestApi:requestUploadAvatar:', userId, localAvatarFile, url);
    try {
      const formData = new FormData();
      // !!! question: upload file on android is need to add 'file://' prefix and type.
      // !!! https://github.com/facebook/react-native/issues/28551
      formData.append('file', {
        uri:
          Platform.OS === 'android'
            ? 'file://' + localAvatarFile
            : localAvatarFile,
        name: userId,
        type:
          fileType ?? Platform.OS === 'android'
            ? `image/${getFileExtension(localAvatarFile)}`
            : `image/${getFileExtension(localAvatarFile)}`,
      });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      console.log(
        'RestApi:requestUploadAvatar:',
        response.ok,
        response.status,
        response.statusText,
        response.url
      );
      const value = await response.json();
      console.log('RestApi:requestUploadAvatar:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: {
          ...value,
          accountType,
          code: RestApi.code(value),
        },
      };
    } catch (error) {
      console.warn('RestApi:requestUploadAvatar:error:', error);
      return { isOk: false, error };
    }
  }

  /**
   * Request rtc token.
   */
  public static async requestRtcToken(params: {
    userId: string;
    channelId: string;
  }): Promise<RequestResult<RequestRtcTokenResult>> {
    const { userId, channelId } = params;
    const url =
      accountType === 'agora'
        ? this.getRtcTokenUrl() + `/${channelId}?userAccount=${userId}`
        : this.getRtcTokenUrl() + `/${channelId}/user/${userId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const value = await response.json();
      console.log('RestApi:requestRtcToken:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: {
          ...value,
          accountType,
          code: RestApi.code(value),
        },
      };
    } catch (error) {
      console.warn('RestApi:requestRtcToken:error:', error);
      return { isOk: false, error };
    }
  }

  /**
   * Request rtc map.
   */
  public static async requestRtcMap(params: {
    channelId: string;
  }): Promise<RequestResult<RequestRtcMapResult>> {
    const { channelId } = params;
    const url = this.getRtcMapUrl() + `?channelName=${channelId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const value = await response.json();
      console.log('RestApi:requestRtcMap:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: {
          ...value,
          accountType,
          code: RestApi.code(value),
        },
      };
    } catch (error) {
      console.warn('RestApi:requestRtcMap:error:', error);
      return { isOk: false, error };
    }
  }

  public static async requestGroupAvatar(params: {
    groupId: string;
  }): Promise<RequestResult<RequestGroupAvatarResult>> {
    const { groupId } = params;
    const url = this.getBasicUrl() + `/group/${groupId}/avatarurl`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const value = await response.json();
      console.log('RestApi:requestGroupAvatar:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: {
          ...value,
          accountType,
          code: RestApi.code(value),
        },
      };
    } catch (error) {
      console.warn('RestApi:requestGroupAvatar:error:', error);
      return { isOk: false, error };
    }
  }

  /**
   * Request destroy account.
   *
   * **Note** agora is not support this api.
   */
  public static async requestDestroyAccount(params: {
    phone: string;
    userToken: string;
  }): Promise<RequestResult<RequestDestroyAccountResult>> {
    const { phone, userToken } = params;
    const url = this.getBasicUrl() + `/user/${phone}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const value = await response.json();
      console.log('RestApi:requestDestroyAccount:', value, url);
      return {
        isOk: RestApi.isOk(value),
        value: {
          ...value,
          accountType,
          code: RestApi.code(value),
        },
      };
    } catch (error) {
      console.warn('RestApi:requestDestroyAccount:error:', error);
      return { isOk: false, error };
    }
  }

  public static async requestGetUserByPhone(params: {
    phone: string;
    chatUserName: string;
    userToken: string;
  }): Promise<RequestResult<RequestGetUserByPhoneResult>> {
    const { phone, chatUserName, userToken } = params;
    const url = this.getBasicUrl() + `/user/${phone}?operator=${chatUserName}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const value = await response.json();
      console.log('RestApi:requestGetUserByPhone:', value, url);
      return value;
    } catch (error) {
      console.warn('RestApi:requestGetUserByPhone:error:', error);
      return { isOk: false, error };
    }
  }
}
