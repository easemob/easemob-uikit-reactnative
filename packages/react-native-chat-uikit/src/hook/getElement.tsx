import * as React from 'react';

export function getElement<Props = any>(
  Component?:
    | React.ComponentType<Props>
    | React.ReactElement
    | null
    | undefined,
  ComponentProps?: Props
) {
  if (Component === undefined || Component === null) {
    return null;
  }
  const isValid = React.isValidElement(Component);
  if (isValid) {
    return Component as React.ReactElement;
  } else if (typeof Component === 'function' || typeof Component === 'object') {
    const C = Component as any; // !!! error TS2604: JSX element type 'Component' does not have any construct or call signatures.
    return (<C {...ComponentProps} />) as React.ReactElement;
  }
  return null;
}
