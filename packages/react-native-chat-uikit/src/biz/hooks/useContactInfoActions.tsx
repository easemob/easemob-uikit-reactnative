import { useI18nContext } from '../../i18n';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseContactInfoActionsProps = BasicActionsProps & {
  /**
   * Remove contact callback.
   */
  onRemoveContact?: (userId: string) => void;
};

/**
 * use contact info actions.
 *
 * Normally the default menu is displayed.
 */
export function useContactInfoActions(props: UseContactInfoActionsProps) {
  const { menuRef, alertRef, onInit, onRemoveContact } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();

  const onShowMenu = (userId: string, userName?: string) => {
    let items = [
      {
        name: '_uikit_info_menu_del_contact',
        isHigh: true,
        onClicked: () => {
          menuRef.current?.startHide?.(() => {
            alertRef.current?.alertWithInit({
              title: tr('_uikit_info_alert_title_delete_contact'),
              message: tr(
                '_uikit_info_alert_content_delete_contact',
                userName ?? userId
              ),
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
                      onRemoveContact?.(userId);
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
