import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseConversationDetailActionsProps = BasicActionsProps & {};
export function useConversationDetailActions(
  props: UseConversationDetailActionsProps
) {
  const { menuRef, onInit } = props;
  const { closeMenu } = useCloseMenu({ menuRef });

  const onShowAVMenu = (params: {
    onClickedVoice?: () => void;
    onClickedVideo?: () => void;
  }) => {
    const { onClickedVoice, onClickedVideo } = params;
    let items = [
      {
        name: '_uikit_chat_input_long_press_av_menu_video',
        isHigh: false,
        onClicked: () => {
          closeMenu(() => {
            onClickedVideo?.();
          });
        },
      },
      {
        name: '_uikit_chat_input_long_press_av_menu_audio',
        isHigh: false,
        onClicked: () => {
          closeMenu(() => {
            onClickedVoice?.();
          });
        },
      },
    ] as InitMenuItemsType[];
    items = onInit ? onInit(items) : items;
    menuRef.current?.startShowWithProps?.({
      initItems: items,
      onRequestModalClose: closeMenu,
      layoutType: 'center',
      hasCancel: false,
    });
  };

  return {
    onShowAVMenu,
  };
}
