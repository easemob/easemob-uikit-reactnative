import * as React from 'react';

import type { AlertRef } from '../../ui/Alert';

export type UseCloseAlertProps = {
  alertRef: React.RefObject<AlertRef>;
};
/**
 * use close alert
 */
export function useCloseAlert(props: UseCloseAlertProps) {
  const { alertRef } = props;
  const closeAlert = React.useCallback(
    (onFinished?: () => void) => {
      alertRef.current?.close?.(() => {
        onFinished?.();
      });
    },
    [alertRef]
  );

  return {
    closeAlert,
  };
}
