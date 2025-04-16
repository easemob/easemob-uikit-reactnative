import {
  gCreateRoomUrl,
  gGetRoomListUrl,
  gRegisterUserUrl,
  gRemoveRoomUrl,
  gSendBroadcastUrl,
} from '../const';
import type { RoomData } from './data';

export class AppServerClient {
  static getLoginToken(params: {
    userId: string;
    nickname: string;
    avatar: string;
    onResult: (params: { isOk: boolean; token?: string }) => void;
  }) {
    const { userId, nickname, avatar } = params;
    fetch(gRegisterUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userId,
        nickname: nickname,
        icon_key: avatar,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('gRegisterUserUrl failed');
        }
      })
      .then((json) => {
        params.onResult({ isOk: true, token: json.access_token });
      })
      .catch((error) => {
        console.warn('dev:getLoginToken:', error);
        params.onResult({ isOk: false });
      });
  }
  static async getLoginTokenSync(params: {
    userId: string;
    nickname: string;
    avatar: string;
  }): Promise<{ isOk: boolean; token?: string }> {
    const { userId, nickname, avatar } = params;
    const response = await fetch(gRegisterUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userId,
        nickname: nickname,
        icon_key: avatar,
      }),
    });
    if (response.status === 200) {
      const json = await response.json();
      return { isOk: true, token: json.access_token };
    }
    return { isOk: false };
  }
  static getRoomList(params: {
    token: string;
    onResult: (params: { isOk: boolean; roomList?: RoomData[] }) => void;
  }) {
    const { token } = params;
    fetch(gGetRoomListUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        // !!! https://github.com/expo/expo/issues/6496
        // tip: There was a problem sending log messages to your development environment [PrettyFormatPluginError: value.hasOwnProperty is not a function.
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('getRoomList failed');
        }
      })
      .then((json) => {
        const jsonList = json.entities as any[];
        const array = [] as RoomData[];
        for (const item of jsonList) {
          const room = {
            roomId: item.id,
            roomName: item.name,
            description: item.description,
            owner: item.owner,
            // permissionType: -1,
            ownerAvatar: item.iconKey,
            ownerNickName: item.nickname,
            // videoUrl: item.ext?.videoUrl,
            // videType: item.video_type,
            // affiliations_count: item.affiliations_count,
            // persistent: item.persistent,
          } as RoomData;
          array.push(room);
        }

        params.onResult({ isOk: true, roomList: array });
      })
      .catch((error) => {
        console.warn('dev:getRoomList:', error);
        params.onResult({ isOk: false });
      });
  }

  static createRoom(params: {
    roomName: string;
    roomOwnerId: string;
    token: string;
    onResult: (params: { isOk: boolean; room?: RoomData }) => void;
  }) {
    const { token, roomName, roomOwnerId } = params;
    fetch(gCreateRoomUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: roomName,
        owner: roomOwnerId,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('createRoom failed');
        }
      })
      .then((json) => {
        const data = json;
        const room = {
          roomId: data.id,
          roomName: data.name,
          description: data.description,
          owner: data.owner,
          // permissionType: -1,
          ownerAvatar: data.iconKey,
          ownerNickName: data.nickname,
          // videoUrl: data.ext?.videoUrl,
          // videType: data.video_type,
          // affiliations_count: data.affiliations_count,
          // persistent: data.persistent,
        } as RoomData;

        params.onResult({ isOk: true, room: room });
      })
      .catch((error) => {
        console.warn('dev:createRoom:', error);
        params.onResult({ isOk: false });
      });
  }

  static removeRoom(params: {
    roomId: string;
    token: string;
    onResult: (params: { isOk: boolean; roomId?: string }) => void;
  }) {
    const { roomId, token } = params;
    fetch(`${gRemoveRoomUrl}${roomId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('removeRoom failed');
        }
      })
      .then((json) => {
        console.log('test:removeRoom:', json);
        const data = json;

        params.onResult({ isOk: true, roomId: data.id });
      })
      .catch((error) => {
        console.warn('dev:removeRoom:', error);
        params.onResult({ isOk: false });
      });
  }

  static sendBroadcast(params: {
    msg: string;
    from: string;
    ext: string;
    token: string;
    onResult: (params: { isOk: boolean; id?: string }) => void;
  }) {
    const { msg, from, ext, token } = params;
    fetch(gSendBroadcastUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        msg: msg,
        from: from,
        ext: ext,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('sendBroadcast failed');
        }
      })
      .then((json) => {
        const data = json.data;

        params.onResult({ isOk: true, id: data.id });
      })
      .catch((error) => {
        console.warn('dev:sendBroadcast:', error);
        params.onResult({ isOk: false });
      });
  }
}
