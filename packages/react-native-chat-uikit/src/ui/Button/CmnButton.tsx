import * as React from 'react';

import type { IconNameType } from '../../assets';
import { Button, type ButtonProps } from './Button';

export type CmnButtonProps = Omit<ButtonProps, 'buttonStyle'>;
export function CmnButton(props: CmnButtonProps) {
  return <Button buttonStyle="commonButton" {...props} />;
}

export type CmnIconButtonProps = Omit<
  CmnButtonProps,
  'contentType' | 'icon'
> & {
  icon: IconNameType;
};
export function CmnIconButton(props: CmnIconButtonProps) {
  return <CmnButton contentType="only-icon" {...props} />;
}
