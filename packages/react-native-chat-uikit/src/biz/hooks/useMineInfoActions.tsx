import { useChatContext } from '../../chat';
import { useConfigContext } from '../../config';
import { useI18nContext } from '../../i18n';
import type { BasicActionsProps } from './types';
import { useCloseAlert } from './useCloseAlert';
import { useCloseMenu } from './useCloseMenu';

export type UseMineInfoActionsProps = BasicActionsProps & {};
export function useMineInfoActions(props: UseMineInfoActionsProps) {
  const { menuRef, alertRef } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const {} = useCloseAlert({ alertRef });
  const { tr } = useI18nContext();
  const im = useChatContext();
  const { enablePresence } = useConfigContext();
  const onShowMenu = () => {
    menuRef.current?.startShowWithProps({
      onRequestModalClose: closeMenu,
      layoutType: 'center',
      hasCancel: true,
      initItems: [
        {
          name: tr('online'),
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'online', onResult: () => {} });
            });
          },
        },
        // {
        //   name: tr('offline'),
        //   isHigh: false,
        //   onClicked: () => {
        //     closeMenu(() => {
        //       im.publishPresence({ status: 'offline', onResult: () => {} });
        //     });
        //   },
        // },
        {
          name: tr('busy'),
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'busy', onResult: () => {} });
            });
          },
        },
        {
          name: tr('leave'),
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'leave', onResult: () => {} });
            });
          },
        },
        {
          name: tr('not disturb'),
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              im.publishPresence({ status: 'no-disturb', onResult: () => {} });
            });
          },
        },
        {
          name: tr('custom'),
          isHigh: false,
          onClicked: () => {
            closeMenu(() => {
              alertRef.current?.alertWithInit({
                title: tr('_uikit_alert_title_custom_status'),
                buttons: [
                  {
                    text: tr('cancel'),
                    onPress: () => {
                      alertRef.current?.close();
                    },
                    isPreferred: false,
                  },
                  {
                    text: tr('confirm'),
                    onPress: (value) => {
                      if (value) {
                        alertRef.current?.close();
                        im.publishPresence({
                          status: value,
                          onResult: () => {},
                        });
                      }
                    },
                    isPreferred: true,
                  },
                ],
                supportInput: true,
                isSaveInput: false,
                inputMaxCount: 20,
                supportInputStatistics: true,
                autoFocus: true,
              });
            });
          },
        },
      ],
    });
  };

  return {
    onShowMineInfoActions: enablePresence === true ? onShowMenu : () => {},
  };
}
