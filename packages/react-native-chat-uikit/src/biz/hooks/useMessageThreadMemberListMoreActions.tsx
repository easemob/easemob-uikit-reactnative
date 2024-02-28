import * as React from 'react';

import { useI18nContext } from '../../i18n';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageThreadMemberListMoreActions = BasicActionsProps & {
  /**
   * Callback notification when click kick member.
   */
  onClickedKickMember?: (threadId: string, memberId: string) => void;
};
export function useMessageThreadMemberListMoreActions(
  props: UseMessageThreadMemberListMoreActions
) {
  const { onClickedKickMember, menuRef, onInit } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const onShowMenu = React.useCallback(
    (threadId: string, memberId: string) => {
      let items = [
        {
          name: tr('_uikit_thread_kick_member'),
          isHigh: false,
          icon: 'slash_in_rectangle',
          onClicked: () => {
            closeMenu(() => {
              onClickedKickMember?.(threadId, memberId);
            });
          },
        },
      ] as InitMenuItemsType[];
      items = onInit ? onInit(items) : items;
      menuRef.current?.startShowWithProps?.({
        initItems: items,
        onRequestModalClose: closeMenu,
        hasCancel: true,
      });
    },
    [closeMenu, menuRef, onClickedKickMember, onInit, tr]
  );

  return {
    onShowMessageThreadMemberListMoreActions: onShowMenu,
  };
}
