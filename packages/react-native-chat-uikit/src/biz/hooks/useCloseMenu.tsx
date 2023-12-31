import * as React from 'react';

import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';

export type useCloseMenuProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
};
export function useCloseMenu(props: useCloseMenuProps) {
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
