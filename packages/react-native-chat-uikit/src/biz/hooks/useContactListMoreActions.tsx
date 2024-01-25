import { useI18nContext } from '../../i18n';
import type { BasicActionsProps } from './types';

export type UseContactListMoreActionsProps = BasicActionsProps & {};

/**
 * use contact list more actions.
 *
 * Normally the default menu is displayed.
 */
export function useContactListMoreActions(
  props: UseContactListMoreActionsProps
) {
  const { alertRef } = props;
  const { tr } = useI18nContext();
  const onShowAlert = (onAddContact: (userId: string) => void) => {
    alertRef.current?.alertWithInit?.({
      title: tr('_uikit_contact_alert_title'),
      message: tr('_uikit_contact_alert_content'),
      supportInput: true,
      isSaveInput: false,
      enableClearButton: true,
      autoFocus: true,
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
  };

  return {
    onShowContactListMoreActions: onShowAlert,
  };
}
