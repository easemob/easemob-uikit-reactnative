import * as React from 'react';

import type { IconNameType } from '../../assets';
import { Button, type ButtonProps } from './Button';

export type Text1ButtonProps = Omit<
  ButtonProps,
  'buttonStyle' | 'contentType' | 'text'
> & {
  text: string;
};
export function Text1Button(props: Text1ButtonProps) {
  return (
    <Button buttonStyle="textButton1" contentType={'only-text'} {...props} />
  );
}

export type Text2ButtonProps = Omit<
  ButtonProps,
  'buttonStyle' | 'contentType' | 'text'
> & {
  text: string;
};
export function Text2Button(props: Text2ButtonProps) {
  return (
    <Button buttonStyle="textButton2" contentType={'only-text'} {...props} />
  );
}

export type Text1IconButtonProps = Omit<
  ButtonProps,
  'buttonStyle' | 'contentType' | 'icon'
> & {
  icon: IconNameType;
};
export function Text1IconButton(props: Text1IconButtonProps) {
  return (
    <Button buttonStyle="textButton1" contentType="only-icon" {...props} />
  );
}

export type Text2IconButtonProps = Omit<
  ButtonProps,
  'buttonStyle' | 'contentType' | 'icon'
> & {
  icon: IconNameType;
};
export function Text2IconButton(props: Text2IconButtonProps) {
  return (
    <Button buttonStyle="textButton2" contentType="only-icon" {...props} />
  );
}
