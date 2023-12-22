import { Platform } from 'react-native';

export function autoFocus(): boolean {
  return Platform.select({
    ios: false,
    android: false,
    default: false,
  });
}

/**
 * {@link file:///Users/asterisk/Codes/zuoyu/react-native-chat-library/node_modules/@types/react-native/index.d.ts}
 * #CameraRollStatic.saveImageWithTag
 *
 * On Android, this is a local URI, such as "file:///sdcard/img.png".
 * On iOS, the tag can be one of the following:
 *      local URI
 *      assets-library tag
 *      a tag not matching any of the above, which means the image data will be stored in memory (and consume memory as long as the process is alive)
 *
 * @param localPath local path.
 *
 * @returns local path
 */
export function localUrl(localPath: string): string {
  return Platform.select({
    ios: localPath,
    android: localPath.includes('file://') ? localPath : `file://${localPath}`,
    default: localPath,
  });
}

export function removeFileHeader(localPath: string): string {
  return Platform.select({
    ios: localPath.startsWith('file://')
      ? localPath.replace('file://', '')
      : localPath,
    android: localPath,
    default: localPath,
  });
}

export function playUrl(localPath: string): string {
  return Platform.select({
    ios: localPath.startsWith('file://') ? localPath : `file://${localPath}`,
    android: localPath,
    default: localPath,
  });
}
export function ImageUrl(localPath: string): string {
  return Platform.select({
    ios: localPath.startsWith('file://') ? localPath : `file://${localPath}`,
    android: localPath.startsWith('file://')
      ? localPath
      : `file://${localPath}`,
    default: localPath,
  });
}
export function localUrlEscape(localPath: string): string {
  if (localPath.startsWith('file://')) {
    return localPath.replace(/#/g, '%23').replace(/ /g, '%20');
  } else {
    return localPath;
  }
  // if (localPath.startsWith('file://')) {
  //   const path = localPath.replace('file://', '');
  //   return `file://${encodeURIComponent(path)}`;
  // } else {
  //   return encodeURIComponent(localPath);
  // }
}
