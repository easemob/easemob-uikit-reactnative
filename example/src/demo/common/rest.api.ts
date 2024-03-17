import { ChatClient } from 'react-native-chat-sdk';
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

export class RestApi {
  private static _protocol: string = 'http://';
  private static _server: string = 'localhost:8096';
  private static _basicUrl: string = '/inside/app';

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

  public static get protocol() {
    return RestApi._protocol;
  }

  public static get server() {
    return RestApi._server;
  }

  public static get basicUrl() {
    return RestApi._basicUrl;
  }

  /**
   * Request a SMS code.
   */
  public static async reqSmsCode(params: { phone: string }): Promise<any> {
    try {
      const { phone } = params;
      const url = this.getBasicUrl() + `/sms/send/${phone}`;
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
    try {
      const { phone, code } = params;
      const url = this.getBasicUrl() + `/user/login/V2`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone, smsCode: code }),
      });
      const value = await response.json();
      console.log('RestApi:reqLogin:', value);
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
    try {
      const { userId, localAvatarFile } = params;
      const url = this.getBasicUrl() + `/user/${userId}/avatar/upload`;
      const formData = new FormData();
      formData.append('file', {
        uri: localAvatarFile,
        name: userId,
        type: getFileExtension(localAvatarFile),
      });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const value = await response.json();
      console.log('RestApi:reqUploadAvatar:', value);
      return { isOk: true, value };
    } catch (error) {
      console.warn('RestApi:reqUploadAvatar:error:', error);
      return { isOk: false, error };
    }
  }
}

export class RtcRestApi {
  private static _rtcTokenUrl: string =
    'https://a1.easemob.com/token/rtcToken/v1';
  private static _mapUrl: string = 'https://a1.easemob.com/channel/mapper';
  private static _regUrl: string =
    'https://a41.easemob.com/app/chat/user/register';
  private static _tokenUrl: string =
    'https://a41.easemob.com/app/chat/user/login';

  protected _(): void {}
  private static async req(params: {
    method: 'GET' | 'POST';
    url: string;
    kvs: any;
    from: 'requestToken' | 'requestUserMap';
    onResult: (p: { data?: any; error?: any }) => void;
  }): Promise<void> {
    console.log('RtcRestApi:req:', params);
    try {
      const accessToken = await ChatClient.getInstance().getAccessToken();
      console.log('RtcRestApi:req:', accessToken);
      const json = params.kvs as {
        userAccount: string;
        channelName: string;
        appkey: string;
        userChannelId?: number;
      };
      const url = `${params.url}?appkey=${encodeURIComponent(
        json.appkey
      )}&channelName=${encodeURIComponent(
        json.channelName
      )}&userAccount=${encodeURIComponent(json.userAccount)}`;
      console.log('RtcRestApi:req:', url);
      const response = await fetch(url, {
        method: params.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const value = await response.json();
      console.log('RtcRestApi:req:', value, value.code);
      if (value.code === 'RES_0K' || value.code === 'RES_OK') {
        if (params.from === 'requestToken') {
          params.onResult({
            data: {
              token: value.accessToken,
              uid: value.agoraUserId ?? json.userChannelId,
            },
          });
        } else if (params.from === 'requestUserMap') {
          params.onResult({
            data: {
              result: value.result,
            },
          });
        }
      } else {
        params.onResult({ error: { code: value.code } });
      }
    } catch (error) {
      params.onResult({ error });
    }
  }
  public static getRtcToken(params: {
    userAccount: string;
    channelId: string;
    appKey: string;
    userChannelId?: number | undefined;
    type?: 'easemob' | 'agora' | undefined;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    const tokenUrl = (url: string) => {
      console.log('test:tokenUrl', params.type, url);
      let ret = url;
      if (params.type !== 'easemob') {
        ret += `/${params.channelId}/agorauid/${params.userChannelId!}`;
      }
      return ret;
    };

    RtcRestApi.req({
      method: 'GET',
      url: tokenUrl(RtcRestApi._rtcTokenUrl),
      kvs: {
        userAccount: params.userAccount,
        channelName: params.channelId,
        appkey: params.appKey,
        userChannelId: params.userChannelId,
      },
      from: 'requestToken',
      onResult: params.onResult,
    });
  }
  public static getRtcMap(params: {
    userAccount: string;
    channelId: string;
    appKey: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    RtcRestApi.req({
      method: 'GET',
      url: RtcRestApi._mapUrl,
      kvs: {
        userAccount: params.userAccount,
        channelName: params.channelId,
        appkey: params.appKey,
      },
      from: 'requestUserMap',
      onResult: params.onResult,
    });
  }

  private static async req2(params: {
    userId: string;
    userPassword: string;
    from: 'registerAccount' | 'getAccountToken';
    onResult: (params: { data?: any; error?: any }) => void;
  }): Promise<void> {
    try {
      let url = '';
      if (params.from === 'getAccountToken') {
        url = RtcRestApi._tokenUrl;
      } else if (params.from === 'registerAccount') {
        url = RtcRestApi._regUrl;
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAccount: params.userId,
          userPassword: params.userPassword,
        }),
      });
      const value = await response.json();
      console.log('test:value:', url, value, value.code);
      if (value.code === 'RES_0K' || value.code === 'RES_OK') {
        if (params.from === 'getAccountToken') {
          params.onResult({ data: { token: value.accessToken } });
        } else if (params.from === 'registerAccount') {
          params.onResult({ data: {} });
        }
      } else {
        params.onResult({ error: { code: value.code } });
      }
    } catch (error) {
      params.onResult({ error });
    }
  }

  public static registerAccount(params: {
    userId: string;
    userPassword: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    this.req2({ ...params, from: 'registerAccount' });
  }

  public static getAccountToken(params: {
    userId: string;
    userPassword: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): void {
    this.req2({ ...params, from: 'getAccountToken' });
  }

  public static set rtcTokenUrl(url: string) {
    RtcRestApi._rtcTokenUrl = url;
  }
  public static set mapUrl(url: string) {
    RtcRestApi._mapUrl = url;
  }
  public static set regUrl(url: string) {
    RtcRestApi._regUrl = url;
  }
  public static set tokenUrl(url: string) {
    RtcRestApi._tokenUrl = url;
  }
}
