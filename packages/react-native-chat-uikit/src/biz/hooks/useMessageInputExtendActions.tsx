import type { AlertRef } from '../../ui/Alert';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import type {
  SendFileProps,
  SendImageProps,
  SendVideoProps,
} from '../ConversationDetail';
import { useCloseMenu } from './useCloseMenu';

export type useMessageInputExtendActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  convId: string;
  selectOnePicture: (params: {
    onResult: (params: SendImageProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  onSelectSendImage: (props: SendImageProps) => void;
  selectOneShortVideo: (params: {
    convId: string;
    onResult: (params: SendVideoProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  onSelectSendVideo: (props: SendVideoProps) => void;
  selectCamera: (params: {
    onResult: (params: SendImageProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  selectFile: (params: {
    onResult: (params: SendFileProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  onSelectSendFile: (props: SendFileProps) => void;
  onSelectSendCard: () => void;
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};
export function useMessageInputExtendActions(
  props: useMessageInputExtendActionsProps
) {
  const {
    convId,
    menuRef,
    selectOnePicture,
    onSelectSendImage,
    selectOneShortVideo,
    onSelectSendVideo,
    selectCamera,
    selectFile,
    onSelectSendFile,
    onSelectSendCard,
    onInit,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const onShowMenu = () => {
    let items = [
      {
        name: '_uikit_chat_input_long_press_menu_picture',
        isHigh: false,
        icon: 'img',
        onClicked: () => {
          closeMenu(() => {
            selectOnePicture({
              onResult: (params) => {
                onSelectSendImage(params);
              },
            });
          });
        },
      },
      {
        name: '_uikit_chat_input_long_press_menu_video',
        isHigh: false,
        icon: 'triangle_in_rectangle',
        onClicked: () => {
          closeMenu(() => {
            selectOneShortVideo({
              convId: convId,
              onResult: (params) => {
                onSelectSendVideo(params);
              },
            });
          });
        },
      },
      {
        name: '_uikit_chat_input_long_press_menu_camera',
        isHigh: false,
        icon: 'camera_fill',
        onClicked: () => {
          closeMenu(() => {
            selectCamera({
              onResult: (params) => {
                onSelectSendImage(params);
              },
            });
          });
        },
      },
      {
        name: '_uikit_chat_input_long_press_menu_file',
        isHigh: false,
        icon: 'folder',
        onClicked: () => {
          closeMenu(() => {
            selectFile({
              onResult: (params) => {
                onSelectSendFile(params);
              },
            });
          });
        },
      },
      {
        name: '_uikit_chat_input_long_press_menu_card',
        isHigh: false,
        icon: 'person_single_fill',
        onClicked: () => {
          closeMenu(() => {
            onSelectSendCard();
          });
        },
      },
    ] as InitMenuItemsType[];
    items = onInit ? onInit(items) : items;
    menuRef.current?.startShowWithProps?.({
      initItems: items,
      onRequestModalClose: closeMenu,
      layoutType: 'left',
      hasCancel: true,
    });
  };

  return {
    onShowMessageInputExtendActions: onShowMenu,
  };
}
