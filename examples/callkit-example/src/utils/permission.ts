import { PermissionsAndroid, PermissionStatus, Platform } from 'react-native';

export async function requestAndroidAudio() {
  if (Platform.OS !== 'android') {
    return true;
  }
  const ret = await PermissionsAndroid.request(
    'android.permission.RECORD_AUDIO'
  );
  if (ret === 'granted') {
    return true;
  }
  return false;
}
export async function requestAndroidVideo() {
  if (Platform.OS !== 'android') {
    return true;
  }
  const permissions = (await PermissionsAndroid.requestMultiple([
    'android.permission.RECORD_AUDIO',
    'android.permission.CAMERA',
  ])) as {
    'android.permission.RECORD_AUDIO': PermissionStatus;
    'android.permission.CAMERA': PermissionStatus;
  };
  return Object.entries(permissions).every((value) => {
    if (value[1] !== 'granted') {
      return false;
    } else {
      return true;
    }
  });
}
