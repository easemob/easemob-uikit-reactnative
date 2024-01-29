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

import {
  CreateStringSet,
  LanguageCode,
  languageCodes,
  StringSet,
} from '../i18n';
import { createDefaultStringSet } from '../i18n/StringSet';
import { Services } from '../services';
import {
  CornerRadiusPaletteType,
  Palette,
  Theme,
  useLightTheme,
} from '../theme';
import type { ReleaseArea } from '../types';
import { getSystemLanguage } from '../utils';
import type { ContainerProps } from './types';

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

export const getLanguagePackage = (
  language: LanguageCode,
  callback?: (
    language: LanguageCode,
    defaultSet: StringSet
  ) => CreateStringSet | StringSet
) => {
  let ret: CreateStringSet | StringSet;
  if (callback) {
    ret = callback(language, createDefaultStringSet(language));
  } else {
    ret = createDefaultStringSet(language);
  }
  return ret;
};

export const getI18nLanguage = (language?: LanguageCode): LanguageCode => {
  let ret = language;
  if (language) {
    const isExisted = languageCodes.includes(language);
    if (isExisted === true) {
      ret = language;
    } else {
      ret = require('../config.local').language as LanguageCode;
    }
  } else {
    ret = getDefaultLanguage();
  }

  console.log('dev:language:i18n:', ret);
  return ret;
};

export const getTranslateLanguage = (language?: LanguageCode): LanguageCode => {
  let ret = language;
  if (language) {
    ret = language;
  } else {
    ret = getDefaultLanguage();
  }

  console.log('dev:language:tl:', ret);
  return ret;
};

export const getReleaseArea = (releaseArea?: ReleaseArea): ReleaseArea => {
  if (releaseArea) {
    return releaseArea;
  }
  let ret = require('../config.local').release_area as ReleaseArea;
  if (ret !== 'global' && ret !== 'china') {
    ret = 'global';
  }
  console.log('dev:releaseArea:', ret);
  return ret;
};

export const getAvatarRadiusStyle = (params: { releaseArea?: ReleaseArea }) => {
  if (params.releaseArea === 'china') {
    return 'extraSmall' as CornerRadiusPaletteType;
  } else {
    return 'extraLarge' as CornerRadiusPaletteType;
  }
};

export const getInputRadiusStyle = (params: { releaseArea?: ReleaseArea }) => {
  if (params.releaseArea === 'china') {
    return 'extraSmall' as CornerRadiusPaletteType;
  } else {
    return 'extraLarge' as CornerRadiusPaletteType;
  }
};

export const getAlertRadiusStyle = (params: { releaseArea?: ReleaseArea }) => {
  if (params.releaseArea === 'china') {
    return 'extraSmall' as CornerRadiusPaletteType;
  } else {
    return 'large' as CornerRadiusPaletteType;
  }
};

export const getBubbleRadiusStyle = (params: { releaseArea?: ReleaseArea }) => {
  if (params.releaseArea === 'china') {
    return ['extraSmall' as CornerRadiusPaletteType];
  } else {
    return [
      'extraSmall' as CornerRadiusPaletteType,
      'medium' as CornerRadiusPaletteType,
      'large' as CornerRadiusPaletteType,
    ];
  }
};

export const useGetTheme = (params: {
  palette: Palette;
  theme?: Theme;
  releaseArea?: ReleaseArea;
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  input?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  alert?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  bubble?: {
    borderRadiusStyle?: CornerRadiusPaletteType[];
  };
}) => {
  const { palette, theme, releaseArea, avatar, input, alert, bubble } = params;
  const light = useLightTheme(palette, releaseArea);
  if (theme) {
    theme.cornerRadius.avatar =
      avatar?.borderRadiusStyle ?? getAvatarRadiusStyle({ releaseArea });
    theme.cornerRadius.input =
      input?.borderRadiusStyle ?? getInputRadiusStyle({ releaseArea });
    theme.cornerRadius.alert =
      alert?.borderRadiusStyle ?? getAlertRadiusStyle({ releaseArea });
    theme.cornerRadius.bubble =
      bubble?.borderRadiusStyle ?? getBubbleRadiusStyle({ releaseArea });
    return theme;
  } else {
    light.cornerRadius.avatar =
      avatar?.borderRadiusStyle ?? getAvatarRadiusStyle({ releaseArea });
    light.cornerRadius.input =
      input?.borderRadiusStyle ?? getInputRadiusStyle({ releaseArea });
    light.cornerRadius.alert =
      alert?.borderRadiusStyle ?? getAlertRadiusStyle({ releaseArea });
    light.cornerRadius.bubble =
      bubble?.borderRadiusStyle ?? getBubbleRadiusStyle({ releaseArea });
    return light;
  }
};

export const useInitServices = (props: ContainerProps) => {
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
