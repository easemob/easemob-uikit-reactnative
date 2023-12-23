import * as React from 'react';
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';
import {
  ChatDownloadStatus,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageType,
} from 'react-native-chat-sdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChatContext } from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { g_not_existed_url } from '../../const';
import { ErrorCode, UIKitError } from '../../error';
import { Services } from '../../services';
import { IconButton } from '../../ui/Button';
import { ImageUrl, localUrlEscape } from '../../utils';
import { ImagePreview } from '../ImagePreview';
import { useImageSize } from './useImageSize';

export type ImageMessagePreviewProps = {
  msgId: string;
  containerStyle?: StyleProp<ViewStyle>;
  onClicked?: () => void;
};
export function ImageMessagePreview(props: ImageMessagePreviewProps) {
  const { containerStyle, onClicked } = props;
  const { url, size } = useImageMessagePreview(props);
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flexGrow: 1,
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <ImagePreview
        source={{
          // uri: localUrlEscape(
          //   ImageUrl(
          //     '/storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/16a23570-a093-11ee-928e-49bce75fc71a.jpg'
          //   )
          // ),
          // uri: 'https://picsum.photos/200/300',
          uri: url,
          ...size,
        }}
        imageStyle={{ ...size }}
      />
      <View
        style={{
          position: 'absolute',
          width: 44,
          height: 44,
          top: top,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'red',
        }}
        onTouchEnd={onClicked}
        // pointerEvents={'none'}
      >
        <IconButton
          iconName={'chevron_left'}
          style={{ height: 24, width: 24 }}
        />
      </View>
    </View>
  );
}

type ImageSize = {
  width: number;
  height: number;
};

export function useImageMessagePreview(props: ImageMessagePreviewProps) {
  const { msgId: propsMsgId } = props;
  const im = useChatContext();
  const [url, setUrl] = React.useState<string>(g_not_existed_url);
  const [size, setSize] = React.useState<ImageSize>({
    width: 300,
    height: 300,
  });
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const { getImageSize } = useImageSize({});

  const onGetMessage = React.useCallback(
    (msgId: string) => {
      im.getMessage({ messageId: msgId })
        .then(async (result) => {
          if (result) {
            if (result.body.type !== ChatMessageType.IMAGE) {
              throw new UIKitError({
                code: ErrorCode.common,
                desc: 'Message type is not ChatMessageType.IMAGE',
              });
            }
            const body = result.body as ChatImageMessageBody;
            const h = body.height ?? 300;
            const w = body.width ?? 300;
            setSize(getImageSize(h, w, winHeight, winWidth));
            const isExisted = await Services.dcs.isExistedFile(body.localPath);
            if (isExisted !== true) {
              im.messageManager.downloadAttachment(result);
            } else {
              setUrl(localUrlEscape(ImageUrl(body.localPath)));
            }
          }
        })
        .catch();
    },
    [getImageSize, im, winHeight, winWidth]
  );

  React.useEffect(() => {
    onGetMessage(propsMsgId);
  }, [onGetMessage, propsMsgId]);

  React.useEffect(() => {
    const listener = {
      onMessageAttachmentChanged: (msg: ChatMessage) => {
        if (msg.msgId === propsMsgId) {
          if (msg.body.type === ChatMessageType.IMAGE) {
            const body = msg.body as ChatImageMessageBody;
            if (body.fileStatus === ChatDownloadStatus.SUCCESS) {
              setUrl(localUrlEscape(ImageUrl(body.localPath)));
            } else if (body.fileStatus === ChatDownloadStatus.FAILED) {
              // todo: download failed
            }
          }
        }
      },
    } as MessageManagerListener;
    im.messageManager.addListener(propsMsgId, listener);
    return () => {
      im.messageManager.removeListener(propsMsgId);
    };
  }, [im.messageManager, propsMsgId]);

  return {
    url,
    size,
  };
}
