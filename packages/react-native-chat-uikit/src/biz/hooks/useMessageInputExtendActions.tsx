import type { InitMenuItemsType } from '../BottomSheetMenu';
import type {
  SendFileProps,
  SendImageProps,
  SendVideoProps,
} from '../ConversationDetail';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageInputExtendActionsProps = BasicActionsProps & {
  /**
   * Conversation ID.
   */
  convId: string;
  /**
   * callback notification of select one picture.
   */
  onSelectOnePicture: (params: {
    onResult: (params: SendImageProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  /**
   * callback notification of select one picture from camera.
   */
  onSelectOnePictureFromCamera: (params: {
    onResult: (params: SendImageProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  /**
   * callback notification of select one picture result.
   */
  onSelectOnePictureResult: (props: SendImageProps) => void;
  /**
   * callback notification of select one short video.
   */
  onSelectOneShortVideo: (params: {
    convId: string;
    onResult: (params: SendVideoProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  /**
   * callback notification of select one short video result.
   */
  onSelectOneShortVideoResult: (props: SendVideoProps) => void;
  /**
   * callback notification of select one file.
   */
  onSelectFile: (params: {
    onResult: (params: SendFileProps) => void;
    onCancel?: (() => void) | undefined;
    onError?: ((error: any) => void) | undefined;
  }) => void;
  /**
   * callback notification of select one file result.
   */
  onSelectFileResult: (props: SendFileProps) => void;
  /**
   * callback notification of select send card.
   *
   * Routing operations are usually required.
   */
  onSelectSendCard: () => void;
};
export function useMessageInputExtendActions(
  props: UseMessageInputExtendActionsProps
) {
  const {
    convId,
    menuRef,
    onSelectOnePicture,
    onSelectOnePictureResult,
    onSelectOneShortVideo,
    onSelectOneShortVideoResult,
    onSelectOnePictureFromCamera,
    onSelectFile,
    onSelectFileResult,
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
            onSelectOnePicture({
              onResult: (params) => {
                onSelectOnePictureResult(params);
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
            onSelectOneShortVideo({
              convId: convId,
              onResult: (params) => {
                onSelectOneShortVideoResult(params);
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
            onSelectOnePictureFromCamera({
              onResult: (params) => {
                onSelectOnePictureResult(params);
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
            onSelectFile({
              onResult: (params) => {
                onSelectFileResult(params);
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
