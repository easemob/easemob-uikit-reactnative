import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

export async function requestFCMPermission() {
  const authStatus = await messaging().requestPermission({
    announcement: true,
  });
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  return enabled;
}

export async function checkFCMPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
    return false;
  }
  return true;
}

export async function requestFcmToken() {
  // https://rnfirebase.io/reference/messaging#getToken
  // await messaging().registerDeviceForRemoteMessages();
  const fcmToken = await messaging().getToken();
  console.log('fcm token: ', fcmToken);
  return fcmToken;
}

export function setBackgroundMessageHandler(params?: {
  onMessage: (msg: any) => void;
}): void {
  messaging().setBackgroundMessageHandler(
    async (msg: FirebaseMessagingTypes.RemoteMessage): Promise<any> => {
      console.log('setBackgroundMessageHandler:', msg);
      params?.onMessage(msg);
    }
  );
}
