import * as React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import {
  ChatDownloadStatus,
  ChatFileMessageBody,
  ChatMessage,
  ChatMessageType,
} from 'react-native-chat-sdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gMessageAttributeFileProgress, useChatContext } from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { Services } from '../../services';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import type { PropsWithBack, PropsWithChildren } from '../types';

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
  };

/**
 * File Message Preview Component.
 */
export function FileMessagePreview(props: FileMessagePreviewProps) {
  const {
    containerStyle,
    children,
    msgId: propsMsgId,
    localMsgId: propsLocalMsgId,
    onBack,
  } = props;
  const im = useChatContext();
  const { top } = useSafeAreaInsets();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });
  const [progress, setProgress] = React.useState(0);

  const onGetMessage = React.useCallback(
    (msgId: string) => {
      im.getMessage({ messageId: msgId })
        .then(async (result) => {
          if (result) {
            if (result.body.type !== ChatMessageType.FILE) {
              throw new UIKitError({
                code: ErrorCode.chat_uikit,
                desc: 'Message type is not ChatMessageType.FILE',
              });
            }
            const body = result.body as ChatFileMessageBody;
            const isExisted = await Services.dcs.isExistedFile(body.localPath);
            if (isExisted !== true) {
              setProgress(0);
              im.messageManager.downloadAttachment(result);
            } else {
              setProgress(100);
            }
          }
        })
        .catch();
    },
    [im]
  );

  React.useEffect(() => {
    onGetMessage(propsMsgId);
  }, [onGetMessage, propsMsgId]);

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
            setProgress(100);
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
            setProgress(progress);
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
            setProgress(100);
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
            setProgress(progress);
          }
        }
      },
    };
    im.messageManager.addListener('FileMessagePreview', listener);
    return () => {
      im.messageManager.removeListener('FileMessagePreview');
    };
  }, [im.messageManager, propsLocalMsgId, propsMsgId]);

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
          <Icon
            name={'chevron_left'}
            style={{ height: 24, width: 24, tintColor: getColor('icon') }}
          />
        </Pressable>
      </View>
    );
  }
}
