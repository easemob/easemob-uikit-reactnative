import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';

export type useContactListMoreActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
};
export function useContactListMoreActions(
  props: useContactListMoreActionsProps
) {
  const { alertRef } = props;
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
