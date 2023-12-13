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
    onClickedSend?: (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
    ) => void;
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

export type SendType = 'text' | 'file' | 'image' | 'voice' | 'video';
export type SendBasicProps = {
  type: SendType;
};
export type SendTextProps = SendBasicProps & {
  content: string;
};
export type SendFileProps = SendBasicProps & {
  localPath: string;
  fileSize?: number;
  displayName?: string;
  fileExtension?: string;
};
export type SendImageProps = SendBasicProps &
  SendFileProps & {
    imageWidth: number;
    imageHeight: number;
  };
export type SendVoiceProps = SendBasicProps &
  SendFileProps & {
    duration: number;
  };
export type SendVideoProps = SendBasicProps &
  SendFileProps & {
    thumbLocalPath: string;
    videoWidth: number;
    videoHeight: number;
    duration?: number;
  };
