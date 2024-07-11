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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video, { LoadError } from 'react-native-video';

import { useChatContext } from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { uilog } from '../../const';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import {
  ChatDownloadStatus,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatVideoMessageBody,
} from '../../rename.chat';
import { Services } from '../../services';
import { Image, LoadingIcon } from '../../ui/Image';
import {
  getFileDirectory,
  getFileExtension,
  LocalPath,
  uuid,
} from '../../utils';
import { BackButton } from '../Back';
import {
  BottomSheetNameMenu,
  BottomSheetNameMenuRef,
} from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks';
import { useImageSize } from '../hooks/useImageSize';
import type { PropsWithBack } from '../types';
import { getImageSizeFromUrl } from './MessageListItem.hooks';

/**
 * Video Message Preview Component properties.
 */
export type VideoMessagePreviewProps = PropsWithBack & {
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
   * Callback function for showing the bottom sheet.
   */
  onShowBottomSheet?: (
    menuRef: React.RefObject<BottomSheetNameMenuRef>
  ) => void;
};

/**
 * Video Message Preview Component.
 */
export function VideoMessagePreview(props: VideoMessagePreviewProps) {
  const { containerStyle, onBack } = props;
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
    menuRef,
    onRequestCloseMenu,
    showBottomSheet,
  } = useVideoMessagePreview(props);
  // const u =
  //   '/var/mobile/Containers/Data/Application/F4EF9F0C-7EAB-44BE-8109-B98E5C8FFD9A/Library/Application Support/HyphenateSDK/appdata/zuoyu/zd2/4c847d40-b526-11ee-94cd-1b34468849ce?em-redirect=true&share-secret=TITLYLUmEe6-5M0HikC84neFGaGOFglbHbtYyO6mFDW8pnhN.mov'; // error
  // const u2 =
  //   'file:///var/mobile/Containers/Data/Application/F4EF9F0C-7EAB-44BE-8109-B98E5C8FFD9A/Library/Application%20Support/HyphenateSDK/appdata/zuoyu/zd2/4c847d40-b526-11ee-94cd-1b34468849ce%3Fem-redirect%3Dtrue%26share-secret%3DTITLYLUmEe6-5M0HikC84neFGaGOFglbHbtYyO6mFDW8pnhN.mov'; // ok
  // const s =
  //   '/var/mobile/Containers/Data/Application/F4EF9F0C-7EAB-44BE-8109-B98E5C8FFD9A/Library/Application Support/HyphenateSDK/appdata/zuoyu/zd2/4c847d40-b526-11ee-94cd-1b34468849ce?em-redirect=true&share-secret=TITLYLUmEe6-5M0HikC84neFGaGOFglbHbtYyO6mFDW8pnhN&vframe=true';

  const { top } = useSafeAreaInsets();
  const { getColor } = useColors({});

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
        onLongPress={showBottomSheet}
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
        onPress={onBack}
        // pointerEvents={'none'}
      >
        <BackButton />
      </Pressable>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
    </View>
  );
}

type ImageSize = {
  width: number;
  height: number;
};

export function useVideoMessagePreview(props: VideoMessagePreviewProps) {
  const { msgId: propsMsgId, msg: propsMsg, onShowBottomSheet } = props;
  const im = useChatContext();
  const videoRef = React.useRef<Video>(null);
  const [url, setUrl] = React.useState<string | undefined>(undefined);
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
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const { closeMenu } = useCloseMenu({ menuRef });

  const genThumb = React.useCallback(
    async (videoPath: string, onFinished: (thumbLocalPath: string) => void) => {
      const isExisted = await Services.dcs.isExistedFile(videoPath);
      if (isExisted !== true) {
        return;
      }
      Services.ms
        .getVideoThumbnail({ url: videoPath })
        .then((tmpFilePath) => {
          if (tmpFilePath !== undefined && tmpFilePath.length > 0) {
            const dir = getFileDirectory(videoPath);
            const extension = getFileExtension(tmpFilePath);
            let localPath = dir + uuid() + extension;
            Services.ms
              .saveFromLocal({
                targetPath: localPath,
                localPath: tmpFilePath,
              })
              .then(() => {
                onFinished(localPath);
              })
              .catch();
          }
        })
        .catch();
    },
    []
  );

  const setThumbSize = React.useCallback(
    (url: string) => {
      getImageSizeFromUrl(
        LocalPath.showImage(url),
        ({ isOk, width, height }) => {
          if (isOk === true) {
            setSize(getImageSize(height!, width!, winHeight, winWidth));
          }
        }
      );
    },
    [getImageSize, winHeight, winWidth]
  );

  const showThumb = React.useCallback(
    async (thumbnailLocalPath: string) => {
      const thumbIsExisted = await Services.dcs.isExistedFile(
        thumbnailLocalPath
      );
      if (thumbIsExisted === true) {
        setThumbSize(thumbnailLocalPath);
        setThumbnailUrl(LocalPath.showImage(thumbnailLocalPath));
      }
    },
    [setThumbSize]
  );

  const download = React.useCallback(
    async (msg: ChatMessage) => {
      if (msg.body.type !== ChatMessageType.VIDEO) {
        throw new UIKitError({
          code: ErrorCode.chat_uikit,
          desc: 'Message type is not ChatMessageType.VIDEO',
        });
      }
      const body = msg.body as ChatImageMessageBody;
      setThumbSize(body.thumbnailRemotePath);
      const isExisted = await Services.dcs.isExistedFile(body.localPath);
      if (isExisted !== true) {
        showThumb(body.thumbnailLocalPath);
        if (msg.isChatThread === true) {
          im.messageManager.downloadAttachmentForThread(msg);
        } else {
          im.messageManager.downloadAttachment(msg);
        }
      } else {
        setShowLoading(false);
        setThumbnailUrl(undefined);
        setUrl(LocalPath.playVideo(body.localPath));
      }
    },
    [im.messageManager, setThumbSize, showThumb]
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

  const onVideoError = React.useCallback((error: LoadError) => {
    uilog.warn('dev:video:error: ', error);
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
        genThumb(body.localPath, (thumbLocalPath) => {
          body.thumbnailLocalPath = thumbLocalPath;
          body.thumbnailStatus = ChatDownloadStatus.SUCCESS;
          im.updateMessage({ message: msg, onResult: () => {} });
        });
      }
    },
    [genThumb, im]
  );

  const onEnd = React.useCallback(() => {
    if (Platform.OS !== 'ios') {
      setPause(true);
    }
  }, []);

  const showBottomSheet = React.useCallback(() => {
    onShowBottomSheet?.(menuRef);
  }, [onShowBottomSheet]);

  React.useEffect(() => {
    if (propsMsg) {
      download(propsMsg);
    } else {
      onGetMessage(propsMsgId);
    }
  }, [download, onGetMessage, propsMsg, propsMsgId]);

  React.useEffect(() => {
    const listener = {
      onMessageAttachmentChanged: (msg: ChatMessage) => {
        if (msg.msgId === propsMsgId) {
          if (msg.body.type === ChatMessageType.VIDEO) {
            const body = msg.body as ChatVideoMessageBody;
            if (body.fileStatus === ChatDownloadStatus.SUCCESS) {
              setUrl(LocalPath.playVideo(body.localPath));
              setShowLoading(false);
              setThumbnailUrl(undefined);
              onGenerateThumbnail(msg);
            } else if (body.fileStatus === ChatDownloadStatus.FAILED) {
              uilog.warn('dev:download failed');
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
    menuRef,
    onRequestCloseMenu: closeMenu,
    showBottomSheet,
  };
}
