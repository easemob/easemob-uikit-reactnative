import * as React from 'react';
import type { ChatMessageThread } from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageThreadMemberListMoreActions = BasicActionsProps & {
  thread: ChatMessageThread;
};
export function useMessageThreadMemberListMoreActions(
  props: UseMessageThreadMemberListMoreActions
) {
  const { thread, menuRef, onInit } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const im = useChatContext();
  const onShowMenu = React.useCallback(
    (params: {
      threadId: string;
      memberId: string;
      /**
       * Callback notification when click kick member.
       */
      onClickedKickMember?: (threadId: string, memberId: string) => void;
    }) => {
      const { threadId, memberId, onClickedKickMember } = params;
      let items = [] as InitMenuItemsType[];
      if (
        thread.owner === im.userId &&
        memberId !== im.userId &&
        thread.threadId === threadId
      ) {
        items.push({
          name: tr('_uikit_thread_kick_member'),
          isHigh: false,
          icon: 'slash_in_rectangle',
          onClicked: () => {
            closeMenu(() => {
              onClickedKickMember?.(threadId, memberId);
            });
          },
        });
      }
      items = onInit ? onInit(items) : items;
      if (items.length > 0) {
        menuRef.current?.startShowWithProps?.({
          initItems: items,
          onRequestModalClose: closeMenu,
          hasCancel: true,
        });
      }
    },
    [closeMenu, im.userId, menuRef, onInit, thread.owner, thread.threadId, tr]
  );

  return {
    onShowMessageThreadMemberListMoreActions: onShowMenu,
  };
}
