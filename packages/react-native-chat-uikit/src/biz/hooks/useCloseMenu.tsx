import * as React from 'react';

import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';

export type UseCloseMenuProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
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
