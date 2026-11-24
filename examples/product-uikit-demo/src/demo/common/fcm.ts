import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  registerDeviceForRemoteMessages,
  requestPermission,
  setBackgroundMessageHandler as setRNFBBackgroundMessageHandler,
  type RemoteMessage,
} from '@react-native-firebase/messaging';

export async function requestFCMPermission() {
  const authStatus = await requestPermission(getMessaging(), {
    announcement: true,
  });
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  return enabled;
}

export async function checkFCMPermission() {
  const authorizationStatus = await requestPermission(getMessaging());

  if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (authorizationStatus === AuthorizationStatus.PROVISIONAL) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
    return false;
  }
  return true;
}

export async function requestFcmToken() {
  // https://rnfirebase.io/reference/messaging#getToken
  await registerDeviceForRemoteMessages(getMessaging());
  const fcmToken = await getToken(getMessaging());
  console.log('fcm token: ', fcmToken);
  return fcmToken;
}

export function setBackgroundMessageHandler(params?: {
  onMessage: (msg: any) => void;
}): void {
  onMessage(getMessaging(), (message: RemoteMessage) => {
    console.log('Foreground state messages:', message);
    params?.onMessage(message);
  });
  setRNFBBackgroundMessageHandler(
    getMessaging(),
    async (msg: RemoteMessage): Promise<any> => {
      console.log('Background & Quit state messages:', msg);
      params?.onMessage(msg);
    }
  );
}
