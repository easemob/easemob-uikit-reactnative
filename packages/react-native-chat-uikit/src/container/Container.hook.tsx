// import CreateThumbnail from '@easemob/react-native-create-thumbnail';
import { CameraRoll as MediaLibrary } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import FirebaseMessage from '@react-native-firebase/messaging';
import * as Audio from 'react-native-audio-recorder-player';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import VideoComponent from 'react-native-video';

import { CreateStringSet, LanguageCode, languageCodes } from '../i18n';
import { Services } from '../services';
import { Palette, Theme, useLightTheme } from '../theme';
import type { ReleaseArea } from '../types';
import { getSystemLanguage } from '../utils';
import type { GlobalContainerProps } from './types';

const getDefaultLanguage = (): LanguageCode => {
  let ret: LanguageCode;
  const systemLanguage = getSystemLanguage();
  if (systemLanguage?.startsWith('zh')) {
    ret = 'zh-Hans';
  } else if (systemLanguage?.startsWith('en')) {
    ret = 'en';
  } else {
    ret = require('../config.local').language as LanguageCode;
  }
  return ret;
};

export const getI18nLanguage = (
  language?: LanguageCode,
  languageBuiltInFactory?: CreateStringSet
): LanguageCode => {
  let ret = language;
  if (language) {
    const isExisted = languageCodes.includes(language);
    if (isExisted === true) {
      ret = language;
    } else if (isExisted === false && languageBuiltInFactory) {
      ret = language;
    } else {
      ret = require('../config.local').language as LanguageCode;
    }
  } else {
    ret = getDefaultLanguage();
  }

  console.log('dev:language:', ret);
  return ret;
};

export const getTranslateLanguage = (language?: LanguageCode): LanguageCode => {
  let ret = language;
  if (language) {
    ret = language;
  } else {
    ret = getDefaultLanguage();
  }

  console.log('dev:language:', ret);
  return ret;
};

export const getReleaseArea = (releaseArea?: ReleaseArea): ReleaseArea => {
  if (releaseArea) {
    return releaseArea;
  }
  let ret = require('../config.local').releaseArea as ReleaseArea;
  if (ret !== 'global' && ret !== 'china') {
    ret = 'global';
  }
  console.log('dev:releaseArea:', ret);
  return ret;
};

export const useGetTheme = (params: {
  palette: Palette;
  theme?: Theme;
  releaseArea?: ReleaseArea;
}) => {
  const { palette, theme, releaseArea } = params;
  const light = useLightTheme(palette, releaseArea);
  if (theme) {
    return theme;
  } else {
    return light;
  }
};

export const useInitServices = (props: GlobalContainerProps) => {
  const {} = props;

  if (Services.cbs === undefined) {
    Services.createClipboardService({
      clipboard: Clipboard,
    });
  }

  if (Services.ls === undefined) {
    Services.createLocalStorageService();
  }

  if (Services.ps === undefined) {
    Services.createPermissionService({
      permissions: Permissions,
      firebaseMessage: FirebaseMessage,
    });
  }

  if (Services.ms === undefined) {
    Services.createMediaService({
      videoModule: VideoComponent,
      videoThumbnail: {} as any,
      imagePickerModule: ImagePicker,
      documentPickerModule: DocumentPicker,
      mediaLibraryModule: MediaLibrary,
      fsModule: FileAccess,
      audioModule: Audio,
      permission: Services.ps,
    });
  }

  if (Services.ns === undefined) {
    Services.createNotificationService({
      firebaseMessage: FirebaseMessage,
      permission: Services.ps,
    });
  }

  if (Services.dcs === undefined) {
    Services.createDirCacheService({
      media: Services.ms,
    });
  }
};
