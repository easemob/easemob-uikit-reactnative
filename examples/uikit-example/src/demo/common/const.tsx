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
export const useSendBox = env.useSendBox ?? false;
export const appKey = env.appKey as string;
export const appId = env.appId as string;
export const appServerDomain = env.appServerDomain as string;
export const imServer = useSendBox ? '180.184.143.60' : undefined;
export const imPort = useSendBox ? '6717' : undefined;
export const enableDNSConfig = useSendBox ? false : undefined;
export const agoraAppId = env.agoraAppId as string;
export const isDevMode = env.isDevMode as boolean;
export const accountType = env.accountType as string;
export const fcmSenderId = env.fcmSenderId as string;
export const twemoji_ttf_name = 'Twemoji-Mozilla';
export const boloo_da_ttf_name = 'Baloo-Da';
export const demoType = env.demoType ?? 4;
export const reactStrictMode = env.reactStrictMode as boolean;
