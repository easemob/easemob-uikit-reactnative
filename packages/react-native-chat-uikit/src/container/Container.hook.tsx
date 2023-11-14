import { CreateStringSet, LanguageCode, languageCodes } from '../i18n';
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
