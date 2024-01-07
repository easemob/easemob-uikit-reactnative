import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import { useCloseMenu } from './useCloseMenu';

export type useContactInfoActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};
export function useContactInfoActions(props: useContactInfoActionsProps) {
  const { menuRef, alertRef, onInit } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const im = useChatContext();

  const onShowMenu = (userId: string, userName?: string) => {
    let items = [
      {
        name: '_uikit_info_menu_del_contact',
        isHigh: true,
        onClicked: () => {
          menuRef.current?.startHide?.(() => {
            alertRef.current?.alertWithInit({
              title: 'Delete Contact',
              message: tr('_uikit_info_alert_content', userName ?? userId),
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
                    alertRef.current?.close?.(() => {
                      im.removeContact({ userId, onResult: () => {} });
                    });
                  },
                },
              ],
            });
          });
        },
      },
    ] as InitMenuItemsType[];
    items = onInit ? onInit(items) : items;
    menuRef.current?.startShowWithProps({
      onRequestModalClose: closeMenu,
      layoutType: 'center',
      hasCancel: true,
      initItems: items,
    });
  };

  return {
    onShowContactInfoActions: onShowMenu,
  };
}
