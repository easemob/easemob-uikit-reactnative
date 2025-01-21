import * as React from 'react';

import { Button, type ButtonProps } from './Button';

export type BorderButtonProps = Omit<ButtonProps, 'buttonStyle'>;
export function BorderButton(props: BorderButtonProps) {
  return <Button buttonStyle="borderButton" {...props} />;
}

export type BorderIconButtonProps = Omit<BorderButtonProps, 'contentType'>;
export function BorderIconButton(props: BorderIconButtonProps) {
  return <BorderButton contentType="only-icon" {...props} />;
}
