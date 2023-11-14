import * as React from 'react';

import { ICON_ASSETS } from '../../assets';
import { useConfigContext } from '../../config';
import { ErrorCode, UIKitError } from '../../error';
import { usePaletteContext } from '../../theme';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';

export type AvatarProps = Omit<DefaultIconImageProps, 'localIcon'>;

/**
 * Avatar component. If the url is incorrect, does not exist, or a network error occurs
 *
 * @param props {@link DefaultIconImageProps}
 * @returns JSX.Element
 */
export function Avatar(props: AvatarProps) {
  const { size, style, borderRadius, ...others } = props;
  const { avatar } = useConfigContext();
  const { cornerRadius } = usePaletteContext();
  const getBorderRadius = (size: number) => {
    if (borderRadius === undefined) {
      switch (avatar.borderRadiusStyle) {
        case 'extraSmall':
          return cornerRadius.extraSmall;
        case 'small':
          return cornerRadius.small;
        case 'medium':
          return cornerRadius.medium;
        case 'large':
          return size / 2;
        default:
          throw new UIKitError({ code: ErrorCode.params });
      }
    }
    return borderRadius;
  };

  return (
    <DefaultIconImage
      localIcon={ICON_ASSETS.person_single_outline('3x')}
      size={size}
      style={style}
      borderRadius={getBorderRadius(size)}
      {...others}
    />
  );
}
