import * as React from 'react';

import { ICON_ASSETS } from '../../assets';
import { useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';

export type AvatarProps = DefaultIconImageProps;

/**
 * Avatar component. If the url is incorrect, does not exist, or a network error occurs
 *
 * @param props {@link DefaultIconImageProps}
 */
export function Avatar(props: AvatarProps) {
  const { size, style, localIcon, ...others } = props;
  const { cornerRadius: corner } = useThemeContext();
  const { cornerRadius } = usePaletteContext();
  const { getBorderRadius } = useGetStyleProps();

  return (
    <DefaultIconImage
      localIcon={localIcon ?? ICON_ASSETS.person_single_outline('3x')}
      size={size}
      style={[
        style,
        {
          borderRadius: getBorderRadius({
            height: size,
            crt: corner.avatar,
            cr: cornerRadius,
            style,
          }),
        },
      ]}
      borderRadius={getBorderRadius({
        height: size,
        crt: corner.avatar,
        cr: cornerRadius,
        style,
      })}
      {...others}
    />
  );
}
