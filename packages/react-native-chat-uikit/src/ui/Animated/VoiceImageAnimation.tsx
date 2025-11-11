import React, { useEffect, useMemo } from 'react';
import { Animated, ColorValue, Easing, StyleSheet, View } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { useFrameAnimationController } from '../hooks/useFrameAnimationController';

const WAVE_IMAGES_RIGHT = {
  wave1: ICON_ASSETS.wave3_right('3x'),
  wave2: ICON_ASSETS.wave1_right('3x'),
  wave3: ICON_ASSETS.wave2_right('3x'),
};

const WAVE_IMAGES_LEFT = {
  wave1: ICON_ASSETS.wave3_left('3x'),
  wave2: ICON_ASSETS.wave1_left('3x'),
  wave3: ICON_ASSETS.wave2_left('3x'),
};
/**
 * The props of VoiceImageAnimation
 */
export interface VoiceImageAnimationProps {
  /** Whether to play, default is false */
  playing?: boolean;

  /** Color (for tintColor), default is '#07C160' (WeChat green) */
  color?: ColorValue;

  /** Duration of each frame (milliseconds), default is 300 */
  frameDuration?: number;

  /** Image size, default is 30 */
  size?: number;

  /** Direction of the wave, default is 'right' */
  direction?: 'right' | 'left';
}

/**
 * Voice playback animation component based on PNG images
 */
export function VoiceImageAnimation({
  playing = false,
  color = '#07C160',
  frameDuration = 300,
  size = 30,
  direction = 'right',
}: VoiceImageAnimationProps) {
  const waveImages =
    direction === 'right' ? WAVE_IMAGES_RIGHT : WAVE_IMAGES_LEFT;
  const frameData = useMemo(
    () => ({
      wave1Opacity: [1, 0, 0],
      wave2Opacity: [0, 1, 0],
      wave3Opacity: [0, 0, 1],
    }),
    []
  );

  const frameCount = Object.values(frameData)[0]?.length ?? 3;

  const {
    animatedValue,
    registerAnimation,
    interpolations,
    play,
    stop,
    isPlaying,
  } = useFrameAnimationController({
    frameData,
    frameCount,
  });

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: frameCount - 1,
        duration: frameDuration * frameCount,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    registerAnimation(animation);
  }, [animatedValue, frameCount, frameDuration, registerAnimation]);

  useEffect(() => {
    if (playing && !isPlaying) {
      play();
    } else if (!playing && isPlaying) {
      stop();
    }
  }, [playing, isPlaying, play, stop]);

  const imageStyle = useMemo(
    () => ({
      width: size,
      height: size,
    }),
    [size]
  );

  return (
    <View style={[styles.container, imageStyle]}>
      <Animated.Image
        source={waveImages.wave1}
        style={[
          styles.image,
          imageStyle,
          {
            opacity: interpolations.wave1Opacity,
            tintColor: color,
          },
        ]}
        resizeMode="contain"
      />

      <Animated.Image
        source={waveImages.wave2}
        style={[
          styles.image,
          imageStyle,
          {
            opacity: interpolations.wave2Opacity,
            tintColor: color,
          },
        ]}
        resizeMode="contain"
      />

      <Animated.Image
        source={waveImages.wave3}
        style={[
          styles.image,
          imageStyle,
          {
            opacity: interpolations.wave3Opacity,
            tintColor: color,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
  },
});
