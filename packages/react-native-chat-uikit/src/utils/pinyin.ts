import { pinyin } from 'pinyin-pro';

export function getPinyinFirsLetter(str?: string, def?: string) {
  if (str === undefined || str === null) {
    return def ?? '#';
  }
  return pinyin(str, {
    toneType: 'none',
    pattern: 'first',
    v: true,
  });
}

export function containsChinese(str: string) {
  const reg = /[\u4e00-\u9fa5]/;
  return reg.test(str);
}
