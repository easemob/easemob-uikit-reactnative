import * as React from 'react';

import { DataModel } from '../../chat';
import {
  BottomSheetReactionDetailRef,
  MessageReactionModel,
} from '../BottomSheetReactionDetail';
import { MessageModel } from '../ConversationDetail';
import { useDataPriority } from './useDataPriority';

export type useMessageReactionListDetailProps = {
  reactionRef: React.RefObject<BottomSheetReactionDetailRef>;
};
export function useMessageReactionListDetail(
  props: useMessageReactionListDetailProps
) {
  const { reactionRef } = props;
  const { getContactInfo } = useDataPriority({});
  const onshow = React.useCallback(
    (params: {
      msgModel: MessageModel;
      onRequestCloseReaction: () => void;
      face?: string;
    }) => {
      const { msgModel, onRequestCloseReaction, face } = params;
      if (msgModel.reactions && msgModel.reactions?.length > 0) {
        reactionRef.current?.startShowWithProps?.({
          reactionList: [
            ...msgModel.reactions.map((v) => {
              return {
                ...v,
                userList: v.userList.map((v) => {
                  return {
                    id: v,
                    name: getContactInfo(v).name,
                    avatar: getContactInfo(v).avatar,
                    type: 'user',
                  } as DataModel;
                }),
              } as MessageReactionModel;
            }),
          ],
          msgId: msgModel.msg.msgId,
          onRequestModalClose: onRequestCloseReaction,
          currentSelected: face,
        });
      }
    },
    [getContactInfo, reactionRef]
  );
  return {
    onShowReactionListDetail: onshow,
  };
}
