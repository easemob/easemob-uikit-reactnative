import * as React from 'react';

import type { MessageNameMenuRef } from '../types';

export type UseCloseMenuProps = {
  menuRef: React.RefObject<MessageNameMenuRef>;
};

/**
 * use close menu.
 */
export function useCloseMenu(props: UseCloseMenuProps) {
  const { menuRef } = props;
  const closeMenu = React.useCallback(
    (onFinished?: () => void) => {
      menuRef.current?.startHide?.(() => {
        onFinished?.();
      });
    },
    [menuRef]
  );

  return {
    closeMenu,
  };
}
