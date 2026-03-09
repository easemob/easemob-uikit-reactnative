import * as React from 'react';

import { calllog } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerFactory';
import { CallkitSdkContextProvider } from '../contexts/CallkitSdkContext';
import type { CallkitSdkContextType } from '../types';
import { onceEx } from '../utils/utils';

/**
 * Initializes the property list of 'callkit'.
 */
export type GlobalContainerProps =
  React.PropsWithChildren<CallkitSdkContextType>;

/**
 * Initializes the entry to 'callkit'.
 *
 * @returns
 */
export function GlobalContainer(
  props: GlobalContainerProps
): React.ReactElement {
  calllog.log('callkit:GlobalContainer:');
  const { children, logHandler, ...others } = props;
  const call = createManagerImpl();
  const init = onceEx((props: CallkitSdkContextType) => {
    calllog.log('callkit:GlobalContainer:onceEx:');
    call.init(props);
  });

  init(others);
  call.setLogHandler(logHandler ? undefined : undefined);

  return (
    <CallkitSdkContextProvider call={call}>
      {children}
    </CallkitSdkContextProvider>
  );
}
