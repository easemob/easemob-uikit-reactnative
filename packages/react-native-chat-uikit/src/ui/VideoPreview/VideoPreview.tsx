import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Image, ImageStyle, Pressable, ViewStyle } from 'react-native';
import Video, { VideoRef } from 'react-native-video';

export interface VideoPreviewProps {
  source: { uri: string } | number;
  thumbnailUrl?: string;
  videoStyle?: ViewStyle;
  thumbnailStyle?: ImageStyle;
  onClicked?: () => void;
  onLongPress?: () => void;
  onError?: (error: any) => void;
}

export interface VideoPreviewRef {
  seek: (time: number, tolerance?: number) => void;
  resume: () => void;
  pause: () => void;
  presentFullscreenPlayer?: () => void;
}

export const VideoPreview = forwardRef<VideoPreviewRef, VideoPreviewProps>(
  (props, ref) => {
    const {
      source,
      videoStyle,
      thumbnailStyle,
      thumbnailUrl,
      onClicked,
      onLongPress,
      onError,
    } = props;
    const videoRef = useRef<VideoRef>(null);
    useImperativeHandle(
      ref,
      () => ({
        seek: (time: number, tolerance?: number) => {
          videoRef.current?.seek(time, tolerance);
        },
        resume: () => {
          videoRef.current?.resume();
        },
        pause: () => {
          videoRef.current?.pause();
        },
        presentFullscreenPlayer: () => {
          videoRef.current?.presentFullscreenPlayer?.();
        },
      }),
      []
    );
    return (
      <Pressable onPress={onClicked} onLongPress={onLongPress}>
        <Video
          ref={videoRef}
          source={source as any}
          resizeMode={'contain'}
          style={videoStyle}
          onError={onError}
        />
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={[{ position: 'absolute' }, thumbnailStyle]}
          />
        ) : null}
      </Pressable>
    );
  }
);
