import * as React from 'react';

import {
  gCustomMessageCreateGroupEventType,
  gCustomMessageCreateThreadTip,
  gCustomMessageRecallEventType,
  getMessageSnapshot,
  getMessageSnapshotParams,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageType,
} from '../../rename.chat';
import { useDataPriority } from './useDataPriority';

export function useMessageSnapshot() {
  const { tr } = useI18nContext();
  const { getMsgInfo } = useDataPriority({});
  const _getMessageSnapshot = React.useCallback(
    (msg?: ChatMessage) => {
      if (msg === undefined || msg === null) {
        return '';
      }
      const isGroup = msg.chatType === ChatMessageChatType.GroupChat;
      const isTip =
        msg.body.type === ChatMessageType.CMD &&
        ((msg.body as ChatCustomMessageBody).event ===
          gCustomMessageCreateGroupEventType ||
          (msg.body as ChatCustomMessageBody).event ===
            gCustomMessageRecallEventType ||
          (msg.body as ChatCustomMessageBody).event ===
            gCustomMessageCreateThreadTip);
      const ret = tr(getMessageSnapshot(msg), ...getMessageSnapshotParams(msg));
      if (isGroup === true && isTip === false) {
        const info = getMsgInfo(msg);
        return `${info.remark ?? info.name ?? info.id}: ${ret}`;
      }
      return ret;
    },
    [getMsgInfo, tr]
  );

  return {
    getMessageSnapshot: _getMessageSnapshot,
  };
}
