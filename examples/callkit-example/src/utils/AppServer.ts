import { ChatClient } from '../rename.callkit';

const appServerDomain = require('../env').appServerDomain;
const accountType = require('../env').accountType;

export class AppServerClient {
  private static _rtcTokenUrl: string =
    accountType === 'easemob'
      ? `${appServerDomain}/inside/token/rtc/channel`
      : `${appServerDomain}/token/rtc/channel`;
  private static _mapUrl: string =
    accountType === 'easemob'
      ? `${appServerDomain}/inside/agora/channel/mapper`
      : `${appServerDomain}/agora/channel/mapper`;
  private static _regUrl: string = `${appServerDomain}/app/chat/user/register`;
  private static _tokenUrl: string = `${appServerDomain}/app/chat/user/login`;

  protected _(): void {}

  /**
   * Request rtc token.
   */
  public static async requestRtcToken(params: {
    userId: string;
    channelId: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): Promise<any> {
    const { userId, channelId } = params;
    const url =
      accountType === 'agora'
        ? AppServerClient._rtcTokenUrl + `/${channelId}?userAccount=${userId}`
        : AppServerClient._rtcTokenUrl + `/${channelId}/user/${userId}`;
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
      params.onResult({
        data: {
          token: value.accessToken,
          uid: value.agoraUid,
        },
      });
    } catch (error) {
      console.warn('RestApi:requestRtcToken:error:', error);
      params.onResult({ error: error });
    }
  }

  /**
   * Request rtc map.
   */
  public static async requestRtcMap(params: {
    channelId: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }): Promise<any> {
    const { channelId } = params;
    const url = AppServerClient._mapUrl + `?channelName=${channelId}`;
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
      params.onResult({
        data: {
          result: value.result,
        },
      });
    } catch (error) {
      console.warn('RestApi:requestRtcMap:error:', error);
      params.onResult({ error: error });
    }
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
        url = AppServerClient._tokenUrl;
      } else if (params.from === 'registerAccount') {
        url = AppServerClient._regUrl;
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
    AppServerClient._rtcTokenUrl = url;
  }
  public static set mapUrl(url: string) {
    AppServerClient._mapUrl = url;
  }
  public static set regUrl(url: string) {
    AppServerClient._regUrl = url;
  }
  public static set tokenUrl(url: string) {
    AppServerClient._tokenUrl = url;
  }
}
