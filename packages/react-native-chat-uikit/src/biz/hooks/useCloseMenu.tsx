import * as React from 'react';

import type { ContextNameMenuRef } from '../types';

export type UseCloseMenuProps = {
  menuRef: React.RefObject<ContextNameMenuRef>;
};

/**
 * use close menu.
 */
export function useCloseMenu(props: UseCloseMenuProps) {
  const { menuRef } = props;
  const closeMenu = React.useCallback(
    (onFinished?: () => void) => {
      const _onFinished = typeof onFinished === 'function' ? onFinished : undefined;
      menuRef.current?.startHide?.(() => {
        _onFinished?.();
      });
    },
    [menuRef]
  );

  return {
    closeMenu,
  };
}
