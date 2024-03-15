import * as React from 'react';

import { ToastView } from './ToastView';
import type { ToastViewRef, ToastViewType } from './types';

/**
 * Context of the ToastView.
 */
export const ToastViewContext = React.createContext<ToastViewType | undefined>(
  undefined
);
ToastViewContext.displayName = 'UIKitToastViewContext';

/**
 * Properties of the ToastView context.
 */
type ToastViewContextProps = React.PropsWithChildren<{}>;

/**
 * The ToastView context's provider.
 */
export function ToastViewContextProvider(props: ToastViewContextProps) {
  const { children } = props;
  const ref = React.useRef<ToastViewRef>({} as any);
  const getToastViewRef = () => ref.current;
  return (
    <ToastViewContext.Provider value={{ getToastViewRef }}>
      {children}
      <ToastView propsRef={ref} />
    </ToastViewContext.Provider>
  );
}

/**
 * Get the ToastView context's value.
 * @returns The ToastView context's value.
 */
export function useToastViewContext(): ToastViewType {
  const toast = React.useContext(ToastViewContext);
  if (!toast) throw Error(`${ToastViewContext.displayName} is not provided`);
  return toast;
}
