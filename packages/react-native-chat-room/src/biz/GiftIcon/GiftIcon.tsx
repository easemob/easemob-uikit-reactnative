import * as React from 'react';

import { ICON_ASSETS } from '../../assets';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';

export type GiftIconProps = Omit<DefaultIconImageProps, 'localIcon'>;

/**
 * Gift icon component. If the url is incorrect, does not exist, or a network error occurs
 *
 * @param props {@link DefaultIconImageProps}
 * @returns JSX.Element
 */
export function GiftIcon(props: GiftIconProps) {
  return (
    <DefaultIconImage localIcon={ICON_ASSETS.gift_color('3x')} {...props} />
  );
}
