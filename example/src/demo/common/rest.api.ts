import { Platform } from 'react-native';
import { getFileExtension } from 'react-native-chat-uikit';

export type RequestResult<Value, Error = any> = {
  isOk: boolean;
  value?: Value | undefined;
  error?: Error | undefined;
};

export type RequestLoginResult = {
  chatUserName: string;
  code: number;
  phoneNumber: string;
  token: string;
  avatarUrl?: string;
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

export class RestApi {
  private static _protocol: string = 'http://';
  private static _server: string = 'localhost:8096';
  private static _basicUrl: string = '/inside/app';
  private static _rtcTokenUrl: string = '/inside/token/rtc/channel';
  private static _rtcMapUrl: string = '/inside/agora/channel/mapper';

  public static setProtocol(protocol: string) {
    this._protocol = protocol;
  }
  public static setServer(server: string) {
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
  public static async reqSmsCode(params: { phone: string }): Promise<any> {
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
    } catch (error) {
      console.warn('RestApi:reqSmsCode:error:', error);
    }
  }

  /**
   * Request login.
   */
  public static async reqLogin(params: {
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
      console.log('RestApi:reqLogin:', value, url);
      return { isOk: true, value };
    } catch (error) {
      console.warn('RestApi:reqLogin:error:', error);
      return { isOk: false, error };
    }
  }

  /**
   * Request upload avatar.
   */
  public static async reqUploadAvatar(params: {
    userId: string;
    localAvatarFile: string;
  }): Promise<RequestResult<RequestUploadAvatarResult>> {
    const { userId, localAvatarFile } = params;
    const url = this.getBasicUrl() + `/user/${userId}/avatar/upload`;
    console.log('RestApi:reqUploadAvatar:', userId, localAvatarFile, url);
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
          Platform.OS === 'android'
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
        'RestApi:reqUploadAvatar:',
        response.ok,
        response.status,
        response.statusText,
        response.url
      );
      const value = await response.json();
      console.log('RestApi:reqUploadAvatar:', value, url);
      return { isOk: true, value };
    } catch (error) {
      console.warn('RestApi:reqUploadAvatar:error:', error);
      return { isOk: false, error };
    }
  }

  public static async reqGetRtcToken(params: {
    userId: string;
    channelId: string;
  }): Promise<RequestResult<RequestRtcTokenResult>> {
    const { userId, channelId } = params;
    const url = this.getRtcTokenUrl() + `/${channelId}/user/${userId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const value = await response.json();
      console.log('RestApi:reqGetRtcToken:', value, url);
      return { isOk: true, value };
    } catch (error) {
      console.warn('RestApi:reqGetRtcToken:error:', error);
      return { isOk: false, error };
    }
  }

  public static async reqGetRtcMap(params: {
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
      console.log('RestApi:reqGetRtcMap:', value, url);
      return { isOk: true, value };
    } catch (error) {
      console.warn('RestApi:reqGetRtcMap:error:', error);
      return { isOk: false, error };
    }
  }
}
