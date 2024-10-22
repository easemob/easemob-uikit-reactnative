import * as React from 'react';

import { useI18nContext } from '../../i18n';
import type { ChatMessageThread } from '../../rename.chat';
import type { InitMenuItemsType } from '../types';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageThreadListMoreActions = BasicActionsProps & {};
export function useMessageThreadListMoreActions(
  props: UseMessageThreadListMoreActions
) {
  const { menuRef, onInit, alertRef } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  // const im = useChatContext();
  const onShowMenu = React.useCallback(
    (params: {
      thread: ChatMessageThread;
      isOwner: boolean;
      /**
       * Callback notification when click edit thread name.
       */
      onClickedEditThreadName?: (thread: ChatMessageThread) => void;
      /**
       * Callback notification when click open thread member list.
       */
      onClickedOpenThreadMemberList?: (thread: ChatMessageThread) => void;
      /**
       * Callback notification when click leave thread.
       */
      onClickedLeaveThread?: (threadId: string) => void;
      /**
       * Callback notification when click destroy thread.
       */
      onClickedDestroyThread?: (threadId: string) => void;
    }) => {
      const {
        thread,
        isOwner,
        onClickedEditThreadName,
        onClickedOpenThreadMemberList,
        onClickedLeaveThread,
        onClickedDestroyThread,
      } = params;
      let items = [] as InitMenuItemsType[];
      if (isOwner === true) {
        items.push({
          name: tr('_uikit_thread_menu_edit_thread_name'),
          isHigh: false,
          icon: 'slash_in_rectangle',
          onClicked: () => {
            closeMenu(() => {});
            onClickedEditThreadName?.(thread);
          },
        });
      }
      items.push({
        name: tr('_uikit_thread_menu_open_thread_member_list'),
        isHigh: false,
        icon: 'person_double_fill',
        onClicked: () => {
          closeMenu(() => {
            onClickedOpenThreadMemberList?.(thread);
          });
        },
      });
      if (isOwner === true) {
        items.push({
          name: tr('_uikit_thread_menu_destroy_thread'),
          isHigh: true,
          icon: 'trash',
          onClicked: () => {
            closeMenu(() => {
              alertRef?.current?.alertWithInit({
                message: tr('_uikit_thread_leave_confirm', true),
                buttons: [
                  {
                    text: tr('cancel'),
                    onPress: () => {
                      alertRef.current?.close?.();
                    },
                  },
                  {
                    text: tr('confirm'),
                    isPreferred: true,
                    onPress: () => {
                      alertRef?.current?.close?.();
                      onClickedDestroyThread?.(thread.threadId);
                    },
                  },
                ],
              });
            });
          },
        });
      } else {
        items.push({
          name: tr('_uikit_thread_menu_leave_thread'),
          isHigh: false,
          icon: 'arrow_right_square_fill',
          onClicked: () => {
            closeMenu(() => {
              onClickedLeaveThread?.(thread.threadId);
            });
          },
        });
      }

      items = onInit ? onInit(items) : items;
      if (items.length > 0) {
        menuRef.current?.startShowWithProps?.({
          initItems: items,
          onRequestModalClose: closeMenu,
          layoutType: 'left',
          hasCancel: false,
        });
      }
    },
    [alertRef, closeMenu, menuRef, onInit, tr]
  );

  return {
    onShowMessageThreadListMoreActions: onShowMenu,
  };
}
