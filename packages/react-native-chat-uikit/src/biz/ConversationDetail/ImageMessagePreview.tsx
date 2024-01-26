import * as React from 'react';
import {
  Dimensions,
  Pressable,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {
  ChatDownloadStatus,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageType,
} from 'react-native-chat-sdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChatContext } from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { Services } from '../../services';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { ImagePreview2 } from '../../ui/ImagePreview';
import { LocalPath } from '../../utils';
import { useImageSize } from '../hooks/useImageSize';
import type { PropsWithBack, PropsWithError } from '../types';
import { getImageSizeFromUrl } from './MessageListItem.hooks';

/**
 * Image Message Preview Component properties.
 */
export type ImageMessagePreviewProps = PropsWithBack &
  PropsWithError & {
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
  };

/**
 * Image Message Preview Component.
 */
export function ImageMessagePreview(props: ImageMessagePreviewProps) {
  const { containerStyle, onBack } = props;
  const { url, size } = useImageMessagePreview(props);
  const { top } = useSafeAreaInsets();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });
  // const u =
  //   '/Users/asterisk/Library/Developer/CoreSimulator/Devices/604D801A-1119-460B-8FA8-EB305EC1D5E8/data/Containers/Data/Application/DED71CD7-7399-4DFB-8AF7-EB8C0B5A2EB6/Library/Application Support/HyphenateSDK/appdata/zuoyu/zd2/cacd5c10-b519-11ee-b1d8-ffc4c34a583c?em-redirect=true&share-secret=ys2DILUZEe6avXPiRjoO3lBSOCOD5wHJ-C5ef9jE3HVmJhes.jpg'; // ok
  // const u2 = `file://${encodeURIComponent(u)}`; // error
  // const u3 = `file://${u}`; // error
  // const u4 =
  //   '/Users/asterisk/Library/Developer/CoreSimulator/Devices/604D801A-1119-460B-8FA8-EB305EC1D5E8/data/Containers/Data/Application/DED71CD7-7399-4DFB-8AF7-EB8C0B5A2EB6/Library/Application Support/HyphenateSDK/appdata/zuoyu/zd2/';
  // const u5 = `file://${encodeURIComponent(
  //   u4
  // )}cacd5c10-b519-11ee-b1d8-ffc4c34a583c?em-redirect=true&share-secret=ys2DILUZEe6avXPiRjoO3lBSOCOD5wHJ-C5ef9jE3HVmJhes.jpg`;
  // const u6 =
  //   '/Users/asterisk/Library/Developer/CoreSimulator/Devices/604D801A-1119-460B-8FA8-EB305EC1D5E8/data/Containers/Data/Application/DED71CD7-7399-4DFB-8AF7-EB8C0B5A2EB6/Library/Application Support/HyphenateSDK/appdata/zuoyu/zd2/1.jpg';
  // const u7 = encodeURIComponent(u6);
  // const u8 = `file://${u6}`; // ok
  // const u9 = '/Users/asterisk/Downloads/2.jpg'; // ok
  // const u10 = `file://${u9}`; // ok
  // const u11 = `file://${encodeURIComponent(u9)}`;

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
      <ImagePreview2
        source={{
          // uri: localUrlEscape(
          //   ImageUrl(
          //     '/storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/16a23570-a093-11ee-928e-49bce75fc71a.jpg'
          //   )
          // ),
          // uri: 'https://picsum.photos/200/300',
          uri: url,
          // uri: u3,
          ...size,
          // width: 100,
          // height: 100,
        }}
        imageStyle={{
          ...size,
          // width: 100,
          // height: 100,
        }}
        containerStyle={{
          width: size.width ?? Dimensions.get('window').width,
          height: size.height ?? Dimensions.get('window').height,
        }}
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
        <Icon
          name={'chevron_left'}
          style={{ height: 24, width: 24, tintColor: getColor('icon') }}
        />
      </Pressable>
    </View>
  );
}

type ImageSize = {
  width: number;
  height: number;
};

export function useImageMessagePreview(props: ImageMessagePreviewProps) {
  const { msgId: propsMsgId, onError } = props;
  const im = useChatContext();
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const [size, setSize] = React.useState<ImageSize>({
    width: 300,
    height: 300,
  });
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const { getImageSize } = useImageSize({});

  const showImage = React.useCallback(
    (url: string) => {
      getImageSizeFromUrl(
        LocalPath.showImage(url),
        ({ isOk, width, height }) => {
          if (isOk === true) {
            setSize(getImageSize(height!, width!, winHeight, winWidth));
          }
        }
      );
      setUrl(LocalPath.showImage(url));
    },
    [getImageSize, winHeight, winWidth]
  );

  const onGetMessage = React.useCallback(
    (msgId: string) => {
      im.getMessage({ messageId: msgId })
        .then(async (result) => {
          if (result) {
            if (result.body.type !== ChatMessageType.IMAGE) {
              throw new UIKitError({
                code: ErrorCode.chat_uikit,
                desc: 'Message type is not ChatMessageType.IMAGE',
              });
            }
            const body = result.body as ChatImageMessageBody;
            const isExisted = await Services.dcs.isExistedFile(body.localPath);
            if (isExisted !== true) {
              showImage(body.remotePath);
              im.messageManager.downloadAttachment(result);
            } else {
              showImage(body.localPath);
            }
          }
        })
        .catch();
    },
    [im, showImage]
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
              showImage(body.localPath);
            } else if (body.fileStatus === ChatDownloadStatus.FAILED) {
              onError?.(
                new UIKitError({
                  code: ErrorCode.chat_uikit,
                  desc: 'file download failed.',
                })
              );
            }
          }
        }
      },
    } as MessageManagerListener;
    im.messageManager.addListener(propsMsgId, listener);
    return () => {
      im.messageManager.removeListener(propsMsgId);
    };
  }, [im.messageManager, onError, propsMsgId, showImage]);

  return {
    url,
    size,
  };
}
