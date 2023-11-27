import type { CornerRadiusPaletteType } from './types';

export function generateCornerRadius(
  type: CornerRadiusPaletteType,
  height?: number
): number {
  let ret = 0;
  switch (type) {
    case 'extraSmall':
      ret = 4;
      break;
    case 'small':
      ret = 8;
      break;
    case 'medium':
      ret = 12;
      break;
    case 'large':
      ret = 16;
      break;
    case 'extraLarge':
      ret = height ? height / 2 : 16;
      break;
  }
  return ret;
}

export function generateExtraSmallCornerRadius(): number {
  return generateCornerRadius('extraSmall');
}

export function generateSmallCornerRadius(): number {
  return generateCornerRadius('small');
}

export function generateMediumCornerRadius(): number {
  return generateCornerRadius('medium');
}

export function generateLargeCornerRadius(): number {
  return generateCornerRadius('large');
}
export function generateExtraLargeCornerRadius(): number {
  return generateCornerRadius('extraLarge');
}
