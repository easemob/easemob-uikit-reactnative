import { ErrorCode, UIKitError } from '../error';
import type { ColorLineGradientDirection, LineGradientPoint } from './types';

export function generateLineGradientPoint(
  direction: ColorLineGradientDirection
): LineGradientPoint {
  switch (direction) {
    case 'bottomToTop':
      return { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } };
    case 'topToBottom':
      return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

    case 'leftToRight':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
    case 'rightToLeft':
      return { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } };

    case 'leftTopToRightBottom':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
    case 'leftBottomToRightTop':
      return { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } };

    case 'rightTopToLeftBottom':
      return { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } };
    case 'rightBottomToLeftTop':
      return { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } };

    default:
      throw new UIKitError({
        code: ErrorCode.enum,
        extra: `ColorLineGradientDirection: ${direction}`,
      });
  }
}
