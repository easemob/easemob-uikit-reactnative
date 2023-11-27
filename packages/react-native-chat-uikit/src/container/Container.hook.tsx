import { CreateStringSet, LanguageCode, languageCodes } from '../i18n';
import { Palette, Theme, useLightTheme } from '../theme';
import type { ReleaseArea } from '../types';
import { getSystemLanguage } from '../utils';

const getDefaultLanguage = (): LanguageCode => {
  let ret: LanguageCode;
  const systemLanguage = getSystemLanguage();
  if (systemLanguage?.includes('zh_CN')) {
    ret = 'zh-Hans';
  } else if (systemLanguage?.includes('en')) {
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
