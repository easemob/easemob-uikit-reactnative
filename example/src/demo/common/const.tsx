// export const gAvatarUrlBasic =
//   'https://a1.easemob.com/easemob/chatroom-uikit/chatfiles/';

// export const gRegisterUserUrl =
//   'https://a1.easemob.com/internal/appserver/liverooms/user/login';

// export const gCreateRoomUrl =
//   'https://a1.easemob.com/internal/appserver/liverooms/';

// export const gGetRoomListUrl =
//   'https://a1.easemob.com/internal/appserver/liverooms';

// export const gSendBroadcastUrl =
//   'https://a1.easemob.com/internal/appserver/liverooms/broadcast';

// export const gRemoveRoomUrl =
//   'https://a1.easemob.com/internal/appserver/liverooms/';

const env = require('../../env');
export const useSendBox = env.useSendBox as boolean;
export const appKey = env.appKey as string;
export const restServer = useSendBox ? 'a1-hsb.easemob.com' : 'a1.easemob.com';
export const imServer = useSendBox ? '180.184.143.60' : undefined;
export const imPort = useSendBox ? '6717' : undefined;
export const enableDNSConfig = useSendBox ? false : undefined;
export const agoraAppId = env.agoraAppId as string;
export const isDevMode = env.isDevMode as boolean;
export const accountType = env.accountType as string;
export const fcmSenderId = env.fcmSenderId as string;
export const twemoji_ttf_name = 'Twemoji-Mozilla';
export const boloo_da_ttf_name = 'Baloo-Da';
