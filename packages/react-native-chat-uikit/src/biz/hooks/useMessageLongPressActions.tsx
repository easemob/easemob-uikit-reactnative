import * as React from 'react';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageStatus,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import { gCustomMessageCardEventType, useChatContext } from '../../chat';
import { useConfigContext } from '../../config';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { BottomSheetEmojiListRef } from '../BottomSheetEmojiList';
import { BottomSheetMenuHeader, InitMenuItemsType } from '../BottomSheetMenu';
import type {
  ConversationDetailModelType,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
} from '../ConversationDetail';
import type { EmojiIconItem } from '../types';
import type { BasicActionsProps } from './types';
import { useCloseMenu } from './useCloseMenu';

export type UseMessageLongPressActionsProps = BasicActionsProps & {
  /**
   * Callback notification of copy completion.
   */
  onCopyFinished?: (content: string) => void;
  /**
   * Callback notification of quote message for input.
   */
  onQuoteMessageForInput?: (model: MessageModel) => void;
  /**
   * Callback notification of edit message for input.
   */
  onEditMessageForInput?: (model: MessageModel) => void;
  /**
   * Callback notification of show report message.
   */
  showReportMessage?: (model: MessageModel) => void;
  /**
   * Callback notification of delete message.
   */
  onDeleteMessage?: (msg: ChatMessage) => void;
  /**
   * Callback notification of recall message.
   */
  onRecallMessage?: (msg: ChatMessage, fromType: 'send' | 'recv') => void;
  /**
   * Callback notification of translate message.
   */
  onTranslateMessage?: (model: MessageModel) => void;
  /**
   * Callback notification of thread message.
   */
  onThread?: (model: MessageModel) => void;
  /**
   * Callback notification of multi selected.
   */
  onClickedMultiSelected?: () => void;

  /**
   * Callback notification of forward message.
   */
  onForwardMessage?: (model: MessageModel) => void;
};
export function useMessageLongPressActions(
  props: UseMessageLongPressActionsProps
) {
  const {
    menuRef,
    onQuoteMessageForInput,
    onEditMessageForInput,
    showReportMessage,
    onDeleteMessage,
    onRecallMessage,
    onCopyFinished,
    onTranslateMessage,
    onClickedMultiSelected,
    onForwardMessage,
    onThread,
    onInit,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const im = useChatContext();
  const { enableTranslate, enableReaction, enableThread } = useConfigContext();

  const isCardMessage = (msg: ChatMessage) => {
    if (msg.body.type === ChatMessageType.CUSTOM) {
      const body = msg.body as ChatCustomMessageBody;
      if (body.event === gCustomMessageCardEventType) {
        return true;
      }
    }
    return false;
  };

  const header = (
    emojiList: EmojiIconItem[],
    onFace?: (face: string) => void
  ) => (
    <BottomSheetMenuHeader
      emojiList={emojiList}
      onClickedEmoji={onFace}
      isEmojiCharacter={true}
    />
  );

  const onShowMenu = (params: {
    id: string;
    model: SystemMessageModel | TimeMessageModel | MessageModel;
    emojiList?: EmojiIconItem[];
    onFace?: (face: string) => void;
    convId: string;
    convType: number;
    comType: ConversationDetailModelType;
  }) => {
    const { model, emojiList, onFace, convType, comType } = params;
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
        msgModel.msg.body.type === ChatMessageType.FILE ||
        (msgModel.msg.body.type === ChatMessageType.CUSTOM &&
          isCardMessage(msgModel.msg))
      ) {
        if (
          msgModel.msg.status === ChatMessageStatus.SUCCESS &&
          enableReaction === true
        ) {
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
      if (
        msgModel.msg.status === ChatMessageStatus.SUCCESS &&
        enableTranslate === true
      ) {
        if (msgModel.msg.body.type === ChatMessageType.TXT) {
          const textBody = msgModel.msg.body as ChatTextMessageBody;
          if (textBody.modifyCount === undefined || textBody.modifyCount <= 5) {
            initItems.push({
              name: tr('_uikit_chat_list_long_press_menu_translate'),
              isHigh: false,
              icon: 'a_in_arrows_round',
              onClicked: () => {
                closeMenu(() => {
                  onTranslateMessage?.(model as MessageModel);
                });
              },
            });
          }
        }
      }
      if (
        msgModel.msg.status === ChatMessageStatus.SUCCESS &&
        convType === 1 &&
        enableThread === true &&
        (comType === 'chat' || comType === 'search')
      ) {
        initItems.push({
          name: tr('_uikit_chat_list_long_press_menu_thread'),
          isHigh: false,
          icon: 'hashtag_in_bubble_fill',
          onClicked: () => {
            closeMenu(() => {
              onThread?.(model as MessageModel);
            });
          },
        });
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
              icon: 'slash_in_rectangle',
              onClicked: () => {
                closeMenu(() => {
                  onEditMessageForInput?.(model as MessageModel);
                });
              },
            });
          }
        }
      }
      initItems.push({
        name: tr('_uikit_chat_list_long_press_menu_multi_select'),
        isHigh: false,
        icon: 'check_n_3lines',
        onClicked: () => {
          closeMenu(() => {
            onClickedMultiSelected?.();
          });
        },
      });
      initItems.push({
        name: tr('_uikit_chat_list_long_press_menu_forward_message'),
        isHigh: false,
        icon: 'check_n_3lines',
        onClicked: () => {
          closeMenu(() => {
            onForwardMessage?.(model as MessageModel);
          });
        },
      });
      if (
        msgModel.msg.status === ChatMessageStatus.SUCCESS &&
        comType !== 'thread'
      ) {
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
            onDeleteMessage?.(msgModel.msg);
          });
        },
      });
      if (
        (msgModel.msg.body.type === ChatMessageType.TXT ||
          msgModel.msg.body.type === ChatMessageType.VOICE ||
          msgModel.msg.body.type === ChatMessageType.IMAGE ||
          msgModel.msg.body.type === ChatMessageType.VIDEO ||
          msgModel.msg.body.type === ChatMessageType.FILE) &&
        comType !== 'thread'
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
                onRecallMessage?.(msgModel.msg, 'send');
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
      hasCancel: false,
      header:
        emojiList && enableReaction === true
          ? header(emojiList, onFace)
          : undefined,
    });
  };

  return {
    onShowMessageLongPressActions: onShowMenu,
  };
}

export type UseEmojiLongPressActionsProps = {
  menuRef: React.RefObject<BottomSheetEmojiListRef>;
};

export function useEmojiLongPressActionsProps(
  props: UseEmojiLongPressActionsProps
) {
  const { menuRef } = props;
  const closeMenu = React.useCallback(() => {
    menuRef.current?.startHide?.();
  }, [menuRef]);
  const onShowMenu = React.useCallback(
    (emojiList: EmojiIconItem[], onFace?: (face: string) => void) => {
      menuRef.current?.startShowWithProps?.({
        onRequestModalClose: closeMenu,
        emojiList,
        onFace,
      });
    },
    [closeMenu, menuRef]
  );
  return {
    onShowEmojiLongPressActions: onShowMenu,
  };
}
