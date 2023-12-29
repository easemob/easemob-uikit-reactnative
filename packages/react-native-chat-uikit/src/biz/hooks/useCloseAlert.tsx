import * as React from 'react';

import type { AlertRef } from '../../ui/Alert';

export type useCloseAlertProps = {
  alertRef: React.RefObject<AlertRef>;
};
export function useCloseAlert(props: useCloseAlertProps) {
  const { alertRef } = props;
  // console.log('test:zuoyu:useCloseAlert', props);
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
