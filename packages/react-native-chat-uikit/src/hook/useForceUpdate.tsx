import * as React from 'react';

/**
 * Force component update.
 */
export const useForceUpdate = () => {
  const [, updater] = React.useState(0);
  return { updater: React.useCallback(() => updater((prev) => prev + 1), []) };
};
