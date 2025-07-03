import { ResizeMode, Video } from 'expo-av';
import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { a_video } from '../assets';

export const BackgroundVideo = () => {
  const { height: winHeight } = useWindowDimensions();
  const ref = React.useRef<Video>(null);
  React.useEffect(() => {
    ref.current?.playAsync();
    () => {
      ref.current?.stopAsync();
    };
  }, []);
  return (
    <View style={[StyleSheet.absoluteFill]} onTouchEnd={() => {}}>
      <Video
        ref={ref}
        source={a_video}
        resizeMode={ResizeMode.COVER}
        isLooping={true}
        shouldPlay={true}
        style={{ width: '100%', height: winHeight }}
        onError={(e) => {
          console.warn('play video error:', e);
        }}
      />
    </View>
  );
};

export const BackgroundVideoMemo = React.memo(BackgroundVideo);
