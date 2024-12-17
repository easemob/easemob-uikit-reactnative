import { ICON_ASSETS, IconNameType } from '../../assets';
import type { IconResolutionType } from './types';

export const getIconSource = (
  name: IconNameType | number,
  resolution?: IconResolutionType
): number => {
  if (typeof name === 'number') {
    return name;
  } else {
    return ICON_ASSETS[name as IconNameType](resolution ?? '3x');
  }
};
