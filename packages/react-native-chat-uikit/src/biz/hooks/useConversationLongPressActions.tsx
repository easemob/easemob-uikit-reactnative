import type { ConversationModel } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';

export type ConversationLongPressActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onDisturb: (conv: ConversationModel) => Promise<void>;
  onPin: (conv: ConversationModel) => Promise<void>;
  onRead: (conv: ConversationModel) => void;
  onRemove: (conv: ConversationModel) => Promise<void>;
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};
export function useConversationLongPressActions(
  props: ConversationLongPressActionsProps
) {
  const { menuRef, alertRef, onDisturb, onPin, onRead, onRemove, onInit } =
    props;
  const { tr } = useI18nContext();
  const onShowMenu = (conv: ConversationModel) => {
    let items = [
      {
        name: conv.doNotDisturb ? 'unmute' : 'mute',
        isHigh: false,
        onClicked: () => {
          onDisturb({ ...conv, doNotDisturb: !conv.doNotDisturb });
          menuRef.current?.startHide?.();
        },
      },
      {
        name: conv.isPinned ? 'unpin' : 'pin',
        isHigh: false,
        onClicked: () => {
          onPin({ ...conv, isPinned: !conv.isPinned });
          menuRef.current?.startHide?.();
        },
      },
      {
        name: '_uikit_conv_menu_read',
        isHigh: false,
        onClicked: () => {
          onRead({ ...conv, unreadMessageCount: 0 });
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
    ] as InitMenuItemsType[];
    items = onInit ? onInit(items) : items;
    menuRef.current?.startShowWithInit?.(items, { title: conv.convName });
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
