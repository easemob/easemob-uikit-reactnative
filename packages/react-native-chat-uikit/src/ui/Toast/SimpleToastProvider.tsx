import * as React from 'react';

import { SimpleToast } from './SimpleToast';
import type { SimpleToastRef, SimpleToastType } from './types';

/**
 * Context of the SimpleToast.
 */
export const SimpleToastContext = React.createContext<
  SimpleToastType | undefined
>(undefined);
SimpleToastContext.displayName = 'UIKitSimpleToastContext';

/**
 * Properties of the SimpleToast context.
 */
type SimpleToastContextProps = React.PropsWithChildren<{}>;

/**
 * The SimpleToast context's provider.
 */
export function SimpleToastContextProvider(props: SimpleToastContextProps) {
  const { children } = props;
  const ref = React.useRef<SimpleToastRef>({} as any);
  const getSimpleToastRef = () => ref.current;
  return (
    <SimpleToastContext.Provider value={{ getSimpleToastRef }}>
      {children}
      <SimpleToast propsRef={ref} />
    </SimpleToastContext.Provider>
  );
}

/**
 * Get the SimpleToast context's value.
 * @returns The SimpleToast context's value.
 */
export function useSimpleToastContext(): SimpleToastType {
  const toast = React.useContext(SimpleToastContext);
  if (!toast) throw Error(`${SimpleToastContext.displayName} is not provided`);
  return toast;
}
