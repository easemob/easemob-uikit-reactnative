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
