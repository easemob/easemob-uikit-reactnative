import * as React from 'react';

/**
 * Function component life cycle calling tool.
 */
export function useLifecycle(
  onLifecycle?: (state: 'load' | 'unload') => void,
  callerName?: string,
  enableLog?: boolean
) {
  const cn = callerName ?? useLifecycle?.caller?.name;
  React.useEffect(() => {
    if (enableLog === true) {
      console.log(`{
        toolName: '${useLifecycle.name}',
        callerName: '${cn}',
        state: 'load',
      }`);
    }

    onLifecycle?.('load');
    return () => {
      if (enableLog === true) {
        console.log(`{
          toolName: '${useLifecycle.name}',
          callerName: '${cn}',
          state: 'unload',
        }`);
      }

      onLifecycle?.('unload');
    };
  }, [cn, enableLog, onLifecycle]);
}
