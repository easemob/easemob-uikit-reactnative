import {
  ChatMessage,
  ChatMessageStatus,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import type {
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
} from '../ConversationDetail';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageLongPressActionsProps = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onCopyFinished?: (content: string) => void;
  onQuoteMessageForInput?: (model: MessageModel) => void;
  onEditMessageForInput?: (model: MessageModel) => void;
  showReportMessage?: (model: MessageModel) => void;
  deleteMessage?: (msg: ChatMessage) => void;
  recallMessage?: (msg: ChatMessage, fromType: 'send' | 'recv') => void;
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};
export function useMessageLongPressActions(
  props: UseMessageLongPressActionsProps
) {
  const {
    menuRef,
    onQuoteMessageForInput,
    onEditMessageForInput,
    showReportMessage,
    deleteMessage,
    recallMessage,
    onCopyFinished,
    onInit,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const im = useChatContext();
  const onShowMenu = (
    _id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => {
    if (model.modelType !== 'message') {
      return;
    }
    let initItems = [] as InitMenuItemsType[];
    const msgModel = model as MessageModel;
    if (model.modelType === 'message') {
      if (msgModel.msg.body.type === ChatMessageType.TXT) {
        initItems.push({
          name: tr('_uikit_chat_list_long_press_menu_copy'),
          isHigh: false,
          icon: 'doc_on_doc',
          onClicked: () => {
            closeMenu(() => {
              const body = msgModel.msg.body as ChatTextMessageBody;
              Services.cbs.setString(body.content);
              onCopyFinished?.(body.content);
            });
          },
        });
      }
      if (
        msgModel.msg.body.type === ChatMessageType.TXT ||
        msgModel.msg.body.type === ChatMessageType.VOICE ||
        msgModel.msg.body.type === ChatMessageType.IMAGE ||
        msgModel.msg.body.type === ChatMessageType.VIDEO ||
        msgModel.msg.body.type === ChatMessageType.FILE
      ) {
        if (msgModel.msg.status === ChatMessageStatus.SUCCESS) {
          initItems.push({
            name: tr('_uikit_chat_list_long_press_menu_replay'),
            isHigh: false,
            icon: 'arrowshape_left',
            onClicked: () => {
              closeMenu(() => {
                onQuoteMessageForInput?.(model as MessageModel);
              });
            },
          });
        }
      }
      if (msgModel.msg.status === ChatMessageStatus.SUCCESS) {
        if (
          msgModel.msg.body.type === ChatMessageType.TXT &&
          msgModel.msg.from === im.userId
        ) {
          const textBody = msgModel.msg.body as ChatTextMessageBody;
          if (textBody.modifyCount === undefined || textBody.modifyCount <= 5) {
            initItems.push({
              name: tr('_uikit_chat_list_long_press_menu_edit'),
              isHigh: false,
              icon: 'img',
              onClicked: () => {
                closeMenu(() => {
                  onEditMessageForInput?.(model as MessageModel);
                });
              },
            });
          }
        }
      }
      if (msgModel.msg.status === ChatMessageStatus.SUCCESS) {
        initItems.push({
          name: tr('_uikit_chat_list_long_press_menu_report'),
          isHigh: false,
          icon: 'envelope',
          onClicked: () => {
            closeMenu(() => {
              showReportMessage?.(msgModel);
            });
          },
        });
      }
      initItems.push({
        name: tr('_uikit_chat_list_long_press_menu_delete'),
        isHigh: false,
        icon: 'trash',
        onClicked: () => {
          closeMenu(() => {
            deleteMessage?.(msgModel.msg);
          });
        },
      });
      if (
        msgModel.msg.body.type === ChatMessageType.TXT ||
        msgModel.msg.body.type === ChatMessageType.VOICE ||
        msgModel.msg.body.type === ChatMessageType.IMAGE ||
        msgModel.msg.body.type === ChatMessageType.VIDEO ||
        msgModel.msg.body.type === ChatMessageType.FILE
      ) {
        if (
          msgModel.msg.status === ChatMessageStatus.SUCCESS &&
          msgModel.msg.from === im.userId
        ) {
          initItems.push({
            name: tr('_uikit_chat_list_long_press_menu_recall'),
            isHigh: false,
            icon: 'arrow_Uturn_anti_clockwise',
            onClicked: () => {
              closeMenu(() => {
                const msgModel = model as MessageModel;
                recallMessage?.(msgModel.msg, 'send');
              });
            },
          });
        }
      }
    }
    if (initItems.length === 0) {
      return;
    }
    initItems = onInit ? onInit(initItems) : initItems;
    menuRef.current?.startShowWithProps?.({
      initItems: initItems,
      onRequestModalClose: closeMenu,
      layoutType: 'left',
      hasCancel: true,
    });
  };

  return {
    onShowMessageLongPressActions: onShowMenu,
  };
}
