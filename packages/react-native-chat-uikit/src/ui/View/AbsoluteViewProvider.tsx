import * as React from 'react';

import { AbsoluteView } from './AbsoluteView';
import type { AbsoluteViewContextType, AbsoluteViewRef } from './types';

/**
 * Context of the AbsoluteView.
 */
export const AbsoluteViewContext = React.createContext<
  AbsoluteViewContextType | undefined
>(undefined);
AbsoluteViewContext.displayName = 'UIKitAbsoluteViewContext';

/**
 * Properties of the AbsoluteView context.
 */
type AbsoluteViewContextProps = React.PropsWithChildren<{}>;

/**
 * The AbsoluteView context's provider.
 */
export function AbsoluteViewContextProvider(props: AbsoluteViewContextProps) {
  const { children } = props;
  const ref = React.useRef<AbsoluteViewRef>({} as any);
  const getAbsoluteViewRef = () => ref.current;
  return (
    <AbsoluteViewContext.Provider value={{ getAbsoluteViewRef }}>
      {children}
      <AbsoluteView propsRef={ref} />
    </AbsoluteViewContext.Provider>
  );
}

/**
 * Get the AbsoluteView context's value.
 * @returns The AbsoluteView context's value.
 */
export function useAbsoluteViewContext(): AbsoluteViewContextType {
  const toast = React.useContext(AbsoluteViewContext);
  if (!toast) throw Error(`${AbsoluteViewContext.displayName} is not provided`);
  return toast;
}
