import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';

export type UseContactListMoreActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onAddContact: (userId: string) => void;
};
export function useContactListMoreActions(
  props: UseContactListMoreActionsProps
) {
  const { alertRef, onAddContact } = props;
  const { tr } = useI18nContext();
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
