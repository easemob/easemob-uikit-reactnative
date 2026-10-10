import * as React from 'react';

import { MessageContextNameMenu } from '../MessageContextMenu/MessageContextNameMenu';

export type UseCloseMenuProps = {
  menuRef: React.RefObject<React.ComponentRef<
    typeof MessageContextNameMenu
  > | null>;
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
