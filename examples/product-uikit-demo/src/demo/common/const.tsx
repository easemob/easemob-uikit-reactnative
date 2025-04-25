// export const gAvatarUrlBasic =
//   'https://${appServerDomain}/easemob/chatroom-uikit/chatfiles/';

// export const gRegisterUserUrl =
//   'https://${appServerDomain}/internal/appserver/liverooms/user/login';

// export const gCreateRoomUrl =
//   'https://${appServerDomain}/internal/appserver/liverooms/';

// export const gGetRoomListUrl =
//   'https://${appServerDomain}/internal/appserver/liverooms';

// export const gSendBroadcastUrl =
//   'https://${appServerDomain}/internal/appserver/liverooms/broadcast';

// export const gRemoveRoomUrl =
//   'https://${appServerDomain}/internal/appserver/liverooms/';

const env = require('../../env');
export const useSandbox =
  env.appServerDomain.length > 0 && env.imServer.length > 0; // from android source code
export const appKey = env.appKey as string;
export const appId = env.appId as string;
export const appServerDomain: string = env.appServerDomain;
export const imServer: string = env.imServer;
export const imPort: number = env.imPort;
export const enableDNSConfig: boolean = !useSandbox;
export const agoraAppId = env.agoraAppId as string;
export const isDevMode = env.isDevMode as boolean;
export const accountType = env.accountType as string;
export const fcmSenderId = env.fcmSenderId as string;
export const twemoji_ttf_name = 'Twemoji-Mozilla';
export const boloo_da_ttf_name = 'Baloo-Da';
