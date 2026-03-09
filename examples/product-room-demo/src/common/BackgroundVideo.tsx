import { useVideoPlayer, VideoView } from 'expo-video';
import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { a_video } from '../assets';

export const BackgroundVideo = () => {
  const { height: winHeight } = useWindowDimensions();
  const ref = React.useRef<VideoView>(null);
  const player = useVideoPlayer(a_video, (p) => {
    p.loop = true;
    p.play();
  });
  player.addListener('statusChange', (status) => {
    console.log('status', status);
  });
  return (
    <View style={[StyleSheet.absoluteFill]} onTouchEnd={() => {}}>
      <VideoView
        ref={ref}
        player={player}
        contentFit={'cover'}
        style={{ width: '100%', height: winHeight }}
      />
    </View>
  );
};

export const BackgroundVideoMemo = React.memo(BackgroundVideo);
