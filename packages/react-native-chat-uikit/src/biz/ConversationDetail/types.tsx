import type { ChatConversationType } from 'react-native-chat-sdk';

import type { PropsWithError, PropsWithTest } from '../types';

export type MessageInputRef = {
  close: () => void;
};
export type MessageInputProps = PropsWithError &
  PropsWithTest & {
    top?: number | undefined;
    bottom?: number | undefined;
    numberOfLines?: number | undefined;
    onClickedSend?: (text: string) => void;
    closeAfterSend?: boolean;
  };
export type MessageInputState = 'normal' | 'emoji' | 'voice' | 'keyboard';

export type ConversationDetailProps = PropsWithError &
  PropsWithTest & {
    convId: string;
    convType: ChatConversationType;
    input?: {
      props?: MessageInputProps;
      render?: React.ForwardRefExoticComponent<
        MessageInputProps & React.RefAttributes<MessageInputRef>
      >;
      ref?: React.RefObject<MessageInputRef>;
    };
  };
