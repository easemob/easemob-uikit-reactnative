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
// export function localUrl(localPath: string): string {
//   return Platform.select({
//     ios: localPath,
//     android: localPath.includes('file://') ? localPath : `file://${localPath}`,
//     default: localPath,
//   });
// }

// export function removeFileHeader(localPath: string): string {
//   return Platform.select({
//     ios: localPath.startsWith('file://')
//       ? localPath.replace('file://', '')
//       : localPath,
//     android: localPath,
//     default: localPath,
//   });
// }

// export function playUrl(localPath: string): string {
//   return Platform.select({
//     ios: localPath.startsWith('file://') ? localPath : `file://${localPath}`,
//     android: localPath,
//     default: localPath,
//   });
// }
// export function ImageUrl(localPath: string): string {
//   return Platform.select({
//     ios: localPath.startsWith('file://') ? localPath : `file://${localPath}`,
//     android: localPath.startsWith('file://')
//       ? localPath
//       : `file://${localPath}`,
//     default: localPath,
//   });
// }
// export function localUrlEscape(localPath: string): string {
//   if (localPath.startsWith('file://')) {
//     return localPath.replace(/#/g, '%23').replace(/ /g, '%20');
//   } else {
//     return localPath;
//   }
//   // if (localPath.startsWith('file://')) {
//   //   const path = localPath.replace('file://', '');
//   //   return `file://${encodeURIComponent(path)}`;
//   // } else {
//   //   return encodeURIComponent(localPath);
//   // }
// }

export class LocalPath {
  static decode(localPath: string): string {
    // !!! maybe file://
    // !!! maybe content://
    if (localPath.startsWith('file://')) {
      const tmp = localPath.replace('file://', '');
      const tmp2 = decodeURIComponent(tmp);
      return tmp2;
    }
    return localPath;
  }
  static encode(localPath: string): string {
    // !!! maybe file://
    // !!! maybe content://
    if (
      localPath.startsWith('file://') === false &&
      localPath.startsWith('content://') === false &&
      localPath.startsWith('http://') === false &&
      localPath.startsWith('https://') === false
    ) {
      const tmp = encodeURIComponent(localPath);
      const tmp2 = `file://${tmp}`;
      return tmp2;
    }
    return localPath;
  }
  static encode2(localPath: string): string {
    // !!! maybe file://
    // !!! maybe content://
    if (
      localPath.startsWith('file://') === false &&
      localPath.startsWith('content://') === false &&
      localPath.startsWith('http://') === false &&
      localPath.startsWith('https://') === false
    ) {
      const tmp = encodeURIComponent(localPath);
      const tmp2 = tmp.replace(/%2F/g, '/');
      const tmp3 = `file://${tmp2}`;
      return tmp3;
    }
    return localPath;
  }
  static addFileHeader(localPath: string): string {
    // !!! maybe file://
    // !!! maybe content://
    if (
      localPath.startsWith('file://') === false &&
      localPath.startsWith('content://') === false &&
      localPath.startsWith('http://') === false &&
      localPath.startsWith('https://') === false
    ) {
      return `file://${localPath}`;
    }
    return localPath;
  }
  static removeFileHeader(localPath: string): string {
    // !!! maybe file://
    // !!! maybe content://
    if (localPath.startsWith('file://') === true) {
      return localPath.replace('file://', '');
    }
    return localPath;
  }

  static playVoice(localPath: string): string {
    if (Platform.OS === 'ios') {
      return LocalPath.addFileHeader(localPath);
    } else if (Platform.OS === 'android') {
      return LocalPath.decode(localPath);
    }
    return localPath;
  }
  static playVideo(localPath: string): string {
    if (Platform.OS === 'ios') {
      return LocalPath.encode2(localPath);
    } else if (Platform.OS === 'android') {
      return LocalPath.encode2(localPath);
    }
    return localPath;
  }
  static showImage(localPath: string): string {
    if (Platform.OS === 'ios') {
      // return LocalPath.encode2(localPath);
    } else if (Platform.OS === 'android') {
      return LocalPath.encode2(localPath);
    }
    return localPath;
  }
  static createImage(localPath: string): string {
    if (Platform.OS === 'ios') {
      return LocalPath.decode(localPath);
    } else if (Platform.OS === 'android') {
      return LocalPath.addFileHeader(localPath);
    }
    return localPath;
  }

  static sendFile(localPath: string): string {
    return LocalPath.decode(localPath);
  }
  static sendImage(localPath: string): string {
    return LocalPath.decode(localPath);
  }
  static sendVideo(localPath: string): string {
    return LocalPath.decode(localPath);
  }
  static sendVoice(localPath: string): string {
    return LocalPath.decode(localPath);
  }

  // static recvFile(localPath: string): string {
  //   return LocalPath.encode(localPath);
  // }
  // static recvImage(localPath: string): string {
  //   return LocalPath.encode(localPath);
  // }
  // static recvVideo(localPath: string): string {
  //   return LocalPath.encode(localPath);
  // }
  // static recvVoice(localPath: string): string {
  //   return LocalPath.encode(localPath);
  // }
}
