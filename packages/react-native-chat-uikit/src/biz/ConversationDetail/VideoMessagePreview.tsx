import * as React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {
  ChatDownloadStatus,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatVideoMessageBody,
} from 'react-native-chat-sdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video, { LoadError } from 'react-native-video';

import { useChatContext } from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { g_not_existed_url } from '../../const';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { Services } from '../../services';
import { usePaletteContext } from '../../theme';
import { Icon, Image, LoadingIcon } from '../../ui/Image';
import {
  getFileDirectory,
  getFileExtension,
  ImageUrl,
  localUrlEscape,
  uuid,
} from '../../utils';
import { useImageSize } from './useImageSize';

export type VideoMessagePreviewProps = {
  msgId: string;
  containerStyle?: StyleProp<ViewStyle>;
  onClicked?: () => void;
};
export function VideoMessagePreview(props: VideoMessagePreviewProps) {
  const { containerStyle, onClicked } = props;
  const {
    url,
    size,
    videoRef,
    onVideoError,
    onClickedVideo,
    onEnd,
    pause,
    thumbnailUrl,
    showLoading,
  } = useVideoMessagePreview(props);
  const { top } = useSafeAreaInsets();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
  });

  return (
    <View
      style={[
        {
          flexGrow: 1,
          backgroundColor: getColor('bg'),
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <Pressable
        onPress={onClickedVideo}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Video
          ref={videoRef}
          source={{
            uri: url,
          }}
          paused={pause}
          onEnd={onEnd}
          // fullscreen={true}
          onError={onVideoError}
          resizeMode={'contain'}
          // posterResizeMode={'contain'}
          style={{
            ...size,
          }}
        />
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={{
              position: 'absolute',
              // backgroundColor: 'red',
              ...size,
            }}
          />
        ) : null}
        {showLoading ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                position: 'absolute',
                // backgroundColor: 'blue',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <LoadingIcon style={{ height: 64, width: 64 }} />
          </View>
        ) : null}
      </Pressable>

      <Pressable
        style={{
          position: 'absolute',
          width: 44,
          height: 44,
          top: top,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClicked}
        // pointerEvents={'none'}
      >
        <Icon
          name={'chevron_left'}
          style={{ height: 24, width: 24, tintColor: getColor('fg') }}
        />
      </Pressable>
    </View>
  );
}

type ImageSize = {
  width: number;
  height: number;
};

export function useVideoMessagePreview(props: VideoMessagePreviewProps) {
  const { msgId: propsMsgId } = props;
  const im = useChatContext();
  const videoRef = React.useRef<Video>(null);
  const [url, setUrl] = React.useState<string>(g_not_existed_url);
  const [size, setSize] = React.useState<ImageSize>({
    width: 300,
    height: 300,
  });
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const [showLoading, setShowLoading] = React.useState(true);
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string | undefined>(
    undefined
  );
  const [pause, setPause] = React.useState(false);
  const { getImageSize } = useImageSize({});

  const onGetMessage = React.useCallback(
    (msgId: string) => {
      im.getMessage({ messageId: msgId })
        .then(async (result) => {
          if (result) {
            if (result.body.type !== ChatMessageType.VIDEO) {
              throw new UIKitError({
                code: ErrorCode.common,
                desc: 'Message type is not ChatMessageType.VIDEO',
              });
            }
            const body = result.body as ChatImageMessageBody;
            const h = body.height ?? winHeight;
            const w = body.width ?? winWidth;
            console.log(
              'test:zuoyu:size:',
              h,
              w,
              getImageSize(h, w, winHeight, winWidth),
              winHeight,
              winWidth
            );
            setSize(getImageSize(h, w, winHeight, winWidth));

            const isExisted = await Services.dcs.isExistedFile(body.localPath);
            if (isExisted !== true) {
              const thumbIsExisted = await Services.dcs.isExistedFile(
                body.thumbnailLocalPath
              );
              if (thumbIsExisted === true) {
                setThumbnailUrl(
                  localUrlEscape(ImageUrl(body.thumbnailLocalPath))
                );
              }
              im.messageManager.downloadAttachment(result);
            } else {
              setShowLoading(false);
              setThumbnailUrl(undefined);
              setUrl(localUrlEscape(ImageUrl(body.localPath)));
            }
          }
        })
        .catch();
    },
    [getImageSize, im, winHeight, winWidth]
  );

  const onVideoError = React.useCallback((error: LoadError) => {
    console.warn('test:zuoyu:video error: ', error);
  }, []);

  const onClickedVideo = React.useCallback(() => {
    if (Platform.OS === 'ios') {
      videoRef.current?.seek(0);
      setPause((v) => !v);
      videoRef.current?.presentFullscreenPlayer();
    } else {
      videoRef.current?.seek(0);
      setPause((v) => !v);
      videoRef.current?.presentFullscreenPlayer();
    }
  }, []);

  const onGenerateThumbnail = React.useCallback(
    async (msg: ChatMessage) => {
      const body = msg.body as ChatVideoMessageBody;
      const isExisted = await Services.dcs.isExistedFile(body.localPath);
      const thumbIsExisted = await Services.dcs.isExistedFile(
        body.thumbnailLocalPath
      );
      if (isExisted === true && thumbIsExisted !== true) {
        Services.ms
          .getVideoThumbnail({ url: body.localPath })
          .then((tmpFilePath) => {
            if (tmpFilePath !== undefined && tmpFilePath.length > 0) {
              const dir = getFileDirectory(body.localPath);
              const extension = getFileExtension(tmpFilePath);
              let localPath = dir + uuid() + extension;
              Services.ms
                .saveFromLocal({
                  targetPath: localPath,
                  localPath: tmpFilePath,
                })
                .then(() => {
                  setThumbnailUrl(undefined);
                  body.thumbnailLocalPath = localPath;
                  body.thumbnailStatus = ChatDownloadStatus.SUCCESS;
                  im.updateMessage({ message: msg, onResult: () => {} });
                })
                .catch();
            }
          })
          .catch();
      }
    },
    [im]
  );

  const onEnd = React.useCallback(() => {
    if (Platform.OS !== 'ios') {
      setPause(true);
    }
  }, []);

  React.useEffect(() => {
    onGetMessage(propsMsgId);
  }, [onGetMessage, propsMsgId]);

  React.useEffect(() => {
    const listener = {
      onMessageAttachmentChanged: (msg: ChatMessage) => {
        if (msg.msgId === propsMsgId) {
          if (msg.body.type === ChatMessageType.VIDEO) {
            const body = msg.body as ChatVideoMessageBody;
            if (body.fileStatus === ChatDownloadStatus.SUCCESS) {
              setUrl(localUrlEscape(ImageUrl(body.localPath)));
              setShowLoading(false);
              setThumbnailUrl(undefined);
              onGenerateThumbnail(msg);
            } else if (body.fileStatus === ChatDownloadStatus.FAILED) {
              console.log('test:zuoyu:download failed');
            }
          }
        }
      },
    } as MessageManagerListener;
    im.messageManager.addListener(propsMsgId, listener);
    return () => {
      im.messageManager.removeListener(propsMsgId);
    };
  }, [im.messageManager, onGenerateThumbnail, propsMsgId]);

  return {
    url,
    size,
    videoRef,
    onVideoError,
    onClickedVideo,
    showLoading,
    thumbnailUrl,
    onEnd,
    pause,
  };
}
