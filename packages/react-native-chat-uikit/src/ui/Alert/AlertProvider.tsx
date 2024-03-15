import * as React from 'react';

import { Alert } from './Alert';
import type { AlertContextType, AlertRef } from './types';

/**
 * Context of the Alert.
 */
export const AlertContext = React.createContext<AlertContextType | undefined>(
  undefined
);
AlertContext.displayName = 'UIKitAlertContext';

/**
 * Properties of the Alert context.
 */
type AlertContextProps = React.PropsWithChildren<{}>;

/**
 * The Alert context's provider.
 */
export function AlertContextProvider(props: AlertContextProps) {
  const { children } = props;
  const ref = React.useRef<AlertRef>({} as any);
  const getAlertRef = () => ref.current;
  return (
    <AlertContext.Provider value={{ getAlertRef }}>
      {children}
      <Alert ref={ref} />
    </AlertContext.Provider>
  );
}

/**
 * Get the Alert context's value.
 * @returns The Alert context's value.
 */
export function useAlertContext(): AlertContextType {
  const alert = React.useContext(AlertContext);
  if (!alert) throw Error(`${AlertContext.displayName} is not provided`);
  return alert;
}
