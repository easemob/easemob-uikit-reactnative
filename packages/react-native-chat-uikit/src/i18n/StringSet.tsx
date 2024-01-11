import { createStringSetCn } from './StringSet.cn';
import { createStringSetEn } from './StringSet.en';
import type { LanguageCode, StringSet } from './types';

export function createDefaultStringSet(type: LanguageCode): StringSet {
  switch (type) {
    case 'en':
      return createStringSetEn();
    case 'zh-Hans':
      return createStringSetCn();
    default:
      return createStringSetEn();
  }
}
