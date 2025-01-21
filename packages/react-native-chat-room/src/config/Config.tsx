import * as React from 'react';

import type { Config } from './types';

/**
 * Context of the config.
 */
export const ConfigContext = React.createContext<Config | undefined>(undefined);
ConfigContext.displayName = 'UIKitConfigContext';

/**
 * Properties of the config context.
 */
type ConfigContextProps = React.PropsWithChildren<{ value: Config }>;

/**
 * The config context's provider.
 *
 * @param props {@link ConfigContextProps}
 * @returns
 */
export function ConfigContextProvider(props: ConfigContextProps) {
  const { children, value } = props;
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

/**
 * The config context's hook.
 *
 * @returns Config {@link Config}
 */
export function useConfigContext(): Config {
  const config = React.useContext(ConfigContext);
  if (!config) throw Error(`${ConfigContext.displayName} is not provided`);
  return config;
}
