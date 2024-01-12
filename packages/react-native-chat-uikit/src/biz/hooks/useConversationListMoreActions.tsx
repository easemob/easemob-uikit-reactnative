import * as React from 'react';

import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import { useCloseMenu } from './useCloseMenu';

export type UseConversationListMoreActionsProps = {
  onClickedNewConversation?: () => void;
  onClickedNewGroup?: () => void;
  onClickedNewContact?: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
  onAddContact: (userId: string) => void;
};
export function useConversationListMoreActions(
  props: UseConversationListMoreActionsProps
) {
  const {
    onClickedNewConversation,
    onClickedNewGroup,
    onClickedNewContact,
    menuRef,
    alertRef,
    onInit,
    onAddContact,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const onShowMenu = React.useCallback(() => {
    let items = [
      {
        name: '_uikit_contact_menu_new_conv',
        isHigh: false,
        icon: 'bubble_fill',
        onClicked: () => {
          closeMenu(() => {
            onClickedNewConversation?.();
          });
        },
      },
      {
        name: '_uikit_contact_menu_add_contact',
        isHigh: false,
        icon: 'person_add_fill',
        onClicked: () => {
          closeMenu(() => {
            if (onClickedNewContact) {
              onClickedNewContact();
            } else {
              alertRef.current?.alertWithInit?.({
                title: tr('_uikit_contact_alert_title'),
                message: tr('_uikit_contact_alert_content'),
                supportInput: true,
                buttons: [
                  {
                    text: tr('cancel'),
                    onPress: () => {
                      alertRef.current?.close?.();
                    },
                  },
                  {
                    text: tr('add'),
                    isPreferred: true,
                    onPress: (value) => {
                      alertRef.current?.close?.(() => {
                        if (value) onAddContact(value);
                      });
                    },
                  },
                ],
              });
            }
          });
        },
      },
      {
        name: '_uikit_contact_menu_create_group',
        isHigh: false,
        icon: 'person_double_fill',
        onClicked: () => {
          closeMenu(() => {
            onClickedNewGroup?.();
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
  }, [
    alertRef,
    closeMenu,
    menuRef,
    onAddContact,
    onClickedNewContact,
    onClickedNewConversation,
    onClickedNewGroup,
    onInit,
    tr,
  ]);

  return {
    onShowConversationListMoreActions: onShowMenu,
  };
}
