import type { ConversationModel } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';

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
            menuRef.current?.startHide(() => {
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
    onShowConversationLongPressActions: onShowMenu,
  };
}
