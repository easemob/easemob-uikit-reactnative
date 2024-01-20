import * as React from 'react';

/**
 * Get the component.
 */
export function getElement<Props = any>(
  Component?:
    | React.ComponentType<Props>
    | React.ReactElement<Props>
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
    const C = Component as React.ComponentType;
    if (ComponentProps === undefined || ComponentProps === null) {
      return (<C />) as React.ReactElement;
    }
    return (<C {...ComponentProps} />) as React.ReactElement;
  }
  return null;
}
