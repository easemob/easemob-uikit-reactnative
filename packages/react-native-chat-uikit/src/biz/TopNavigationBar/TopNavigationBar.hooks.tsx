import { ConversationModel, useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';

export type useConversationListMoreActionsProps = {
  onClickedNewConversation?: () => void;
  onClickedNewGroup?: () => void;
  onClickedNewContact?: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
};
export function useConversationListMoreActions(
  props: useConversationListMoreActionsProps
) {
  const {
    onClickedNewConversation,
    onClickedNewGroup,
    onClickedNewContact,
    menuRef,
    alertRef,
  } = props;
  console.log('test:zuoyu:useConversationListMoreActions', props);
  const { tr } = useI18nContext();
  const im = useChatContext();
  const onRequestMenuClose = () => {
    menuRef.current?.startHide?.();
  };
  const onShowMenu = () => {
    menuRef.current?.startShowWithProps?.({
      initItems: [
        {
          name: '_uikit_contact_menu_new_conv',
          isHigh: false,
          icon: 'bubble_fill',
          onClicked: () => {
            menuRef.current?.startHide?.();
            onClickedNewConversation?.();
          },
        },
        {
          name: '_uikit_contact_menu_add_contact',
          isHigh: false,
          icon: 'person_add_fill',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
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
                        alertRef.current?.close?.();
                        if (value) {
                          im.addNewContact({
                            useId: value.trim(),
                            reason: 'add contact',
                            onResult: (_result) => {
                              // todo:
                            },
                          });
                        }
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
            menuRef.current?.startHide?.(() => {
              onClickedNewGroup?.();
            });
          },
        },
      ],
      onRequestModalClose: onRequestMenuClose,
      layoutType: 'left',
      hasCancel: false,
    });
  };

  return {
    onRequestMenuClose,
    onShowConversationListMoreActions: onShowMenu,
  };
}

export type ConversationLongPressActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onDisturb: (conv: ConversationModel) => Promise<void>;
  onPin: (conv: ConversationModel) => Promise<void>;
  onRead: (conv: ConversationModel) => void;
  onRemove: (conv: ConversationModel) => Promise<void>;
};
export function useConversationLongPressActions(
  props: ConversationLongPressActionsProps
) {
  console.log('test:zuoyu:useConversationLongPressActions');
  const { menuRef, alertRef, onDisturb, onPin, onRead, onRemove } = props;
  const { tr } = useI18nContext();
  const onRequestMenuClose = () => {
    menuRef.current?.startHide?.();
  };
  const onShowMenu = (conv: ConversationModel) => {
    menuRef.current?.startShowWithInit?.(
      [
        {
          name: conv.doNotDisturb ? 'unmute' : 'mute',
          isHigh: false,
          onClicked: () => {
            onDisturb(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: conv.isPinned ? 'unpin' : 'pin',
          isHigh: false,
          onClicked: () => {
            onPin(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: '_uikit_conv_menu_read',
          isHigh: false,
          onClicked: () => {
            onRead(conv);
            menuRef.current?.startHide?.();
          },
        },
        {
          name: '_uikit_conv_menu_delete',
          isHigh: true,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              onShowAlert(conv);
            });
          },
        },
      ],
      { title: conv.convName }
    );
  };

  const onShowAlert = (conv: ConversationModel) => {
    alertRef.current?.alertWithInit?.({
      title: tr('_uikit_conv_alert_title'),
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current?.close?.();
          },
        },
        {
          text: tr('remove'),
          isPreferred: true,
          onPress: () => {
            alertRef.current?.close?.();
            onRemove(conv);
          },
        },
      ],
    });
  };

  return {
    onRequestMenuClose,
    onShowConversationLongPressActions: onShowMenu,
  };
}

export type useContactListMoreActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
};
export function useContactListMoreActions(
  props: useConversationListMoreActionsProps
) {
  const { alertRef } = props;
  console.log('test:zuoyu:useConversationListMoreActions', props);
  const { tr } = useI18nContext();
  const im = useChatContext();
  const onShowAlert = () => {
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
            alertRef.current?.close?.();
            if (value) {
              im.addNewContact({
                useId: value.trim(),
                reason: 'add contact',
                onResult: (_result) => {
                  // todo:
                },
              });
            }
          },
        },
      ],
    });
  };

  return {
    onShowContactListMoreActions: onShowAlert,
  };
}
