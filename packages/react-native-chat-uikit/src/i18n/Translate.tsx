import type {
  CreateStringSet,
  LanguageCode,
  StringSet,
  StringSetValueType,
} from './types';

export interface Translate {
  tr(key: string, ...args: any[]): string;
}

export class TranslateImpl implements Translate {
  map: Map<string, StringSetValueType>;
  language: LanguageCode;
  tr(key: string, ...args: any[]): string {
    const r = this.map.get(key);
    if (r) {
      if (typeof r === 'string') {
        return r;
      } else {
        return r(...args);
      }
    }
    return key;
  }
  currentLanguage(): LanguageCode {
    return this.language;
  }
  constructor(params: {
    assets: CreateStringSet | StringSet;
    type: LanguageCode;
  }) {
    this.map = new Map();
    this.language = params.type;
    this.append(params);
  }
  append(params: { assets: CreateStringSet | StringSet; type: LanguageCode }) {
    if (typeof params.assets === 'function') {
      const stringSet = params.assets(params.type);
      const keys = Object.keys(stringSet);
      for (const key of keys) {
        this.map.set(key, stringSet[key]!);
      }
    } else {
      const keys = Object.keys(params.assets);
      for (const key of keys) {
        this.map.set(key, params.assets[key]!);
      }
    }
  }
}
