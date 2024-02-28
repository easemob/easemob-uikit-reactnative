import * as React from 'react';
import type { ChatMessageThread } from 'react-native-chat-sdk';

import { useI18nContext } from '../../i18n';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageThreadListMoreActions = BasicActionsProps & {
  /**
   * Callback notification when click edit thread name.
   */
  onClickedEditThreadName?: (threadId: string, threadName: string) => void;
  /**
   * Callback notification when click open thread member list.
   */
  onClickedOpenThreadMemberList?: (thread: ChatMessageThread) => void;
  /**
   * Callback notification when click leave thread.
   */
  onClickedLeaveThread?: (threadId: string) => void;
};
export function useMessageThreadListMoreActions(
  props: UseMessageThreadListMoreActions
) {
  const {
    onClickedEditThreadName,
    onClickedOpenThreadMemberList,
    onClickedLeaveThread,
    menuRef,
    onInit,
    alertRef,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const onShowMenu = React.useCallback(
    (thread: ChatMessageThread) => {
      let items = [
        {
          name: tr('_uikit_thread_menu_edit_thread_name'),
          isHigh: false,
          icon: 'slash_in_rectangle',
          onClicked: () => {
            closeMenu(() => {
              onClickedEditThreadName?.(thread.threadId, thread.threadName);
            });
          },
        },
        {
          name: tr('_uikit_thread_menu_open_thread_member_list'),
          isHigh: false,
          icon: 'person_double_fill',
          onClicked: () => {
            closeMenu(() => {
              onClickedOpenThreadMemberList?.(thread);
            });
          },
        },
        {
          name: tr('_uikit_thread_menu_leave_thread'),
          isHigh: false,
          icon: 'arrow_right_square_fill',
          onClicked: () => {
            console.log('test:zuoyu:234');
            closeMenu(() => {
              alertRef?.current?.alertWithInit({
                message: tr('_uikit_thread_leave_confirm'),
                buttons: [
                  {
                    text: 'cancel',
                    onPress: () => {
                      alertRef.current?.close?.();
                    },
                  },
                  {
                    text: 'confirm',
                    isPreferred: true,
                    onPress: () => {
                      alertRef?.current?.close?.();
                      onClickedLeaveThread?.(thread.threadId);
                    },
                  },
                ],
              });
            });
          },
        },
      ] as InitMenuItemsType[];
      items = onInit ? onInit(items) : items;
      menuRef.current?.startShowWithProps?.({
        initItems: items,
        onRequestModalClose: closeMenu,
        layoutType: 'left',
        hasCancel: false,
      });
    },
    [
      alertRef,
      closeMenu,
      menuRef,
      onClickedEditThreadName,
      onClickedLeaveThread,
      onClickedOpenThreadMemberList,
      onInit,
      tr,
    ]
  );

  return {
    onShowMessageThreadListMoreActions: onShowMenu,
  };
}
