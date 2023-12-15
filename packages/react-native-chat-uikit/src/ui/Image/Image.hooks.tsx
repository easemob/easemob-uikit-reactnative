import { ICON_ASSETS, IconNameType } from '../../assets';
import type { IconResolutionType } from './types';

export const getIconSource = (
  name?: IconNameType | number | undefined,
  resolution?: IconResolutionType
): number | undefined => {
  if (typeof name === 'number') {
    return name;
  } else {
    if (name === undefined || name === null) {
      return undefined;
    }
    return ICON_ASSETS[name as IconNameType](resolution ?? '3x');
  }
};
