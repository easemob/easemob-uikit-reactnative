import * as React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BackButton,
  ChatDownloadStatus,
  ChatFileMessageBody,
  ChatMessage,
  ChatMessageType,
  CmnButton,
  ErrorCode,
  gMessageAttributeFileProgress,
  MessageManagerListener,
  PropsWithBack,
  PropsWithChildren,
  Services,
  Text,
  UIKitError,
  useChatContext,
  useI18nContext,
} from '../../rename.uikit';

/**
 * File Message Preview Component properties.
 */
export type FileMessagePreviewProps = PropsWithBack &
  PropsWithChildren & {
    /**
     * Message id.
     */
    msgId: string;
    /**
     * local message id.
     */
    localMsgId: string;
    /**
     * Chat message.
     */
    msg?: ChatMessage;
    /**
     * Container style for the file preview component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * File download callback notification.
     *
     * @param progress [0, 100]
     * @returns void
     */
    onProgress?: (progress: number) => void;

    /**
     * Open file callback.
     */
    onOpenFile?: (localPath: string) => void;
  };

/**
 * File Message Preview Component.
 */
export function FileMessagePreview(props: FileMessagePreviewProps) {
  const {
    containerStyle,
    children,
    msgId: propsMsgId,
    msg: propsMsg,
    localMsgId: propsLocalMsgId,
    onBack,
    onOpenFile: propsOnOpenFile,
    onProgress: propsOnProgress,
  } = props;
  const im = useChatContext();
  const { top } = useSafeAreaInsets();
  const [progress, setProgress] = React.useState(0);
  const { tr } = useI18nContext();
  const localPath = React.useRef<string | undefined>(undefined);

  const onProgress = React.useCallback(
    (p: number) => {
      setProgress(p);
      propsOnProgress?.(p);
    },
    [propsOnProgress]
  );

  const download = React.useCallback(
    async (msg: ChatMessage) => {
      if (msg.body.type !== ChatMessageType.FILE) {
        throw new UIKitError({
          code: ErrorCode.chat_uikit,
          desc: 'Message type is not ChatMessageType.FILE',
        });
      }
      const body = msg.body as ChatFileMessageBody;
      localPath.current = body.localPath;
      const isExisted = await Services.dcs.isExistedFile(body.localPath);
      if (isExisted !== true) {
        onProgress(0);
        if (msg.isChatThread === true) {
          im.messageManager.downloadAttachmentForThread(msg);
        } else {
          im.messageManager.downloadAttachment(msg);
        }
      } else {
        onProgress(100);
      }
    },
    [im.messageManager, onProgress]
  );

  const onGetMessage = React.useCallback(
    (msgId: string) => {
      im.getMessage({ messageId: msgId })
        .then(async (msg) => {
          if (msg) {
            download(msg);
          }
        })
        .catch();
    },
    [download, im]
  );

  const onOpenFile = React.useCallback(async () => {
    console.log('test:zuoyu:onOpenFile:', localPath.current);
    propsOnOpenFile?.(localPath.current ?? '');
  }, [propsOnOpenFile]);

  React.useEffect(() => {
    if (propsMsg) {
      download(propsMsg);
    } else {
      onGetMessage(propsMsgId);
    }
  }, [download, onGetMessage, propsMsg, propsMsgId]);

  React.useEffect(() => {
    const listener: MessageManagerListener = {
      onSendMessageChanged: (msg: ChatMessage) => {
        // upload progress
        if (
          msg.localMsgId === propsLocalMsgId &&
          msg.body.type === ChatMessageType.FILE
        ) {
          const body = msg.body as ChatFileMessageBody;
          if (body.fileStatus === ChatDownloadStatus.SUCCESS) {
            onProgress(100);
          }
        }
      },
      onSendMessageProgressChanged: (msg: ChatMessage) => {
        // upload progress
        if (
          msg.localMsgId === propsLocalMsgId &&
          msg.body.type === ChatMessageType.FILE
        ) {
          const progress = msg.attributes?.[gMessageAttributeFileProgress];
          if (progress) {
            onProgress(progress);
          }
        }
      },
      onMessageAttachmentChanged: (msg: ChatMessage) => {
        // download progress
        if (
          msg.msgId === propsMsgId &&
          msg.body.type === ChatMessageType.FILE
        ) {
          const body = msg.body as ChatFileMessageBody;
          if (body.fileStatus === ChatDownloadStatus.SUCCESS) {
            onProgress(100);
          }
        }
      },
      onMessageAttachmentProgressChanged: (msg: ChatMessage) => {
        // download progress
        if (
          msg.msgId === propsMsgId &&
          msg.body.type === ChatMessageType.FILE
        ) {
          const progress = msg.attributes?.[gMessageAttributeFileProgress];
          if (progress) {
            onProgress(progress);
          }
        }
      },
    };
    im.messageManager.addListener('FileMessagePreview', listener);
    return () => {
      im.messageManager.removeListener('FileMessagePreview');
    };
  }, [im.messageManager, propsLocalMsgId, propsMsgId, onProgress]);

  if (children) {
    return <View style={[{ flexGrow: 1 }, containerStyle]}>{children}</View>;
  } else {
    return (
      <View
        style={[
          { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
          containerStyle,
        ]}
      >
        <Text>{progress}</Text>
        <CmnButton
          text={tr('open')}
          contentType={'only-text'}
          onPress={onOpenFile}
        />
        <Pressable
          style={{
            position: 'absolute',
            width: 44,
            height: 44,
            top: top,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',
          }}
          onPress={onBack}
          // pointerEvents={'none'}
        >
          <BackButton />
        </Pressable>
      </View>
    );
  }
}
