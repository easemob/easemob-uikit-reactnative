import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseAlert } from './useCloseAlert';
import { useCloseMenu } from './useCloseMenu';

export type useMineInfoActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
};
export function useMineInfoActions(props: useMineInfoActionsProps) {
  const { menuRef, alertRef } = props;
  // console.log('test:zuoyu:useMineInfoActions', props);
  const { closeMenu } = useCloseMenu({ menuRef });
  const {} = useCloseAlert({ alertRef });
  const {} = useI18nContext();
  const im = useChatContext();
  const onShowMenu = () => {
    menuRef.current?.startShowWithProps({
      onRequestModalClose: closeMenu,
      layoutType: 'center',
      hasCancel: true,
      initItems: [
        {
          name: 'Online',
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'online', onResult: () => {} });
            });
          },
        },
        {
          name: 'Busy',
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'busy', onResult: () => {} });
            });
          },
        },
        {
          name: 'Leave',
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'leave', onResult: () => {} });
            });
          },
        },
        {
          name: 'Not Disturb',
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'no-disturb', onResult: () => {} });
            });
          },
        },
      ],
    });
  };

  return {
    onShowMineInfoActions: onShowMenu,
  };
}
