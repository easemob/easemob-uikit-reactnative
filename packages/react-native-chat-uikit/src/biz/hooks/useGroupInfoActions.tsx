import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import { useCloseAlert } from './useCloseAlert';
import { useCloseMenu } from './useCloseMenu';

export type useGroupInfoActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onGroupQuit?: (groupId: string) => void;
  onClickedChangeGroupOwner?: (groupId: string, ownerId: string) => void;
  onGroupDestroy?: (groupId: string) => void;
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};
export function useGroupInfoActions(props: useGroupInfoActionsProps) {
  const {
    menuRef,
    alertRef,
    onGroupQuit,
    onClickedChangeGroupOwner,
    onGroupDestroy,
    onInit,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { closeAlert } = useCloseAlert({ alertRef });
  const { tr } = useI18nContext();
  const im = useChatContext();
  const onShowMenu = (userId: string, ownerId: string, groupId: string) => {
    if (userId !== ownerId) {
      let items = [
        {
          name: tr('quit_group'),
          isHigh: true,
          onClicked: () => {
            closeMenu(() => {
              alertRef.current?.alertWithInit({
                title: tr('_uikit_info_alert_quit_group_title'),
                message: tr('_uikit_info_alert_quit_group_content'),
                buttons: [
                  {
                    text: tr('cancel'),
                    onPress: () => {
                      closeAlert();
                    },
                  },
                  {
                    text: tr('Quit'),
                    isPreferred: true,
                    onPress: () => {
                      closeAlert();
                      im.quitGroup({
                        groupId,
                        onResult: () => {
                          onGroupQuit?.(groupId);
                        },
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
        hasCancel: true,
        layoutType: 'center',
        initItems: items,
      });
    } else {
      let items = [
        {
          name: tr('_uikit_info_menu_change_group_owner'),
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              onClickedChangeGroupOwner?.(groupId, ownerId);
            });
          },
        },
        {
          name: tr('_uikit_info_menu_destroy_group'),
          isHigh: true,
          onClicked: () => {
            closeMenu(() => {
              alertRef.current?.alertWithInit({
                title: tr('_uikit_info_alert_destroy_group_title'),
                message: tr('_uikit_info_alert_destroy_group_content'),
                buttons: [
                  {
                    text: tr('cancel'),
                    onPress: () => {
                      closeAlert();
                    },
                  },
                  {
                    text: tr('confirm'),
                    isPreferred: true,
                    onPress: () => {
                      closeAlert(() => {
                        if (onGroupDestroy) {
                          onGroupDestroy?.(groupId);
                        } else {
                          im.destroyGroup({
                            groupId,
                            onResult: () => {},
                          });
                        }
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
        hasCancel: true,
        layoutType: 'center',
        initItems: items,
      });
    }
  };

  return {
    onShowGroupInfoActions: onShowMenu,
    menuRef,
    alertRef,
  };
}
