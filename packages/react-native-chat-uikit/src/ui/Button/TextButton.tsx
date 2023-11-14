import * as React from 'react';

import type { IconNameType } from '../../assets';
import { Button, type ButtonProps } from './Button';

export type Text1ButtonProps = Omit<ButtonProps, 'buttonStyle'>;
export function Text1Button(props: Text1ButtonProps) {
  return <Button buttonStyle="textButton1" {...props} />;
}

export type Text2ButtonProps = Omit<ButtonProps, 'buttonStyle'>;
export function Text2Button(props: Text2ButtonProps) {
  return <Button buttonStyle="textButton2" {...props} />;
}

export type Text1IconButtonProps = Omit<
  Text1ButtonProps,
  'contentType' | 'icon'
> & {
  icon: IconNameType;
};
export function Text1IconButton(props: Text1IconButtonProps) {
  return <Text1Button contentType="only-icon" {...props} />;
}

export type Text2IconButtonProps = Omit<
  Text2ButtonProps,
  'contentType' | 'icon'
> & {
  icon: IconNameType;
};
export function Text2IconButton(props: Text2IconButtonProps) {
  return <Text2Button contentType="only-icon" {...props} />;
}
