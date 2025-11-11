import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';

export interface UseFrameAnimationControllerConfig {
  initialValue?: number;
  interpolateConfig?: Animated.InterpolationConfigType;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  onStop?: () => void;
}

export interface UseFrameAnimationControllerReturn<
  TFrameData extends Record<string, number[]> = Record<string, number[]>,
  TInterpolations = Record<
    keyof TFrameData,
    Animated.AnimatedInterpolation<number>
  >,
> {
  animatedValue: Animated.Value;
  registerAnimation: (animation: Animated.CompositeAnimation) => void;
  interpolations: TInterpolations;
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
}

export function useFrameAnimationController<
  TFrameData extends Record<string, number[]> = Record<string, number[]>,
  TInterpolations = Record<
    keyof TFrameData,
    Animated.AnimatedInterpolation<number>
  >,
>(params: {
  frameData: TFrameData;
  frameCount: number;
  config?: UseFrameAnimationControllerConfig;
  createInterpolations?: (params: {
    animatedValue: Animated.Value;
    frameData: TFrameData;
    frameCount: number;
    config?: Animated.InterpolationConfigType;
  }) => TInterpolations;
}): UseFrameAnimationControllerReturn<TFrameData, TInterpolations> {
  const {
    frameData,
    frameCount,
    config,
    createInterpolations: createInterpolationsFn,
  } = params;
  const {
    initialValue = 0,
    onPlayStart,
    onPlayEnd,
    onStop,
    interpolateConfig,
  } = config ?? {};

  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  const interpolations = useMemo<TInterpolations>(
    () =>
      createInterpolationsFn?.({
        animatedValue,
        frameData,
        frameCount,
        config: interpolateConfig,
      }) ??
      createInterpolations<TFrameData, TInterpolations>({
        animatedValue,
        frameData,
        frameCount,
        config: interpolateConfig,
      }),
    [
      animatedValue,
      createInterpolationsFn,
      frameCount,
      frameData,
      interpolateConfig,
    ]
  );

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const registerAnimation = useCallback(
    (animation: Animated.CompositeAnimation) => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animationRef.current = animation;
    },
    []
  );

  const play = useCallback(() => {
    if (!animationRef.current) {
      console.warn(
        '[useFrameAnimationController] No animation registered. Call registerAnimation first.'
      );
      return;
    }

    onPlayStart?.();

    animationRef.current.start(({ finished }) => {
      if (finished) {
        setIsPlaying(false);
        onPlayEnd?.();
      }
    });

    setIsPlaying(true);
  }, [onPlayStart, onPlayEnd]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      requestAnimationFrame(() => {
        // !!! `animatedValue.setValue(initialValue);` It causes the animation value to shake.
        animationRef.current?.reset();
        setIsPlaying(false);
        onStop?.();
      });
    }
  }, [onStop]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  // for debug
  // useEffect(() => {
  //   console.log('test:zuoyu:interpolations:', interpolations);
  //   console.log('test:zuoyu:animatedValue:', animatedValue);
  //   console.log('test:zuoyu:isPlaying:', isPlaying);
  //   console.log('test:zuoyu:animationRef:', animationRef.current);
  //   console.log('test:zuoyu:onPlayStart:', onPlayStart);
  //   console.log('test:zuoyu:onPlayEnd:', onPlayEnd);
  //   console.log('test:zuoyu:onStop:', onStop);
  //   console.log('test:zuoyu:config:', config);
  //   const listener = animatedValue.addListener((value) => {
  //     console.log('test:zuoyu:animatedValue:', value);
  //   });
  //   return () => {
  //     animatedValue.removeListener(listener);
  //   };
  // }, [
  //   animatedValue,
  //   interpolations,
  //   isPlaying,
  //   onPlayEnd,
  //   onPlayStart,
  //   onStop,
  //   config,
  // ]);

  return {
    animatedValue,
    interpolations,
    play,
    stop,
    isPlaying,
    registerAnimation,
  };
}

export function createInterpolations<
  TFrameData extends Record<string, number[]>,
  TInterpolations = Record<
    keyof TFrameData,
    Animated.AnimatedInterpolation<number>
  >,
>(params: {
  animatedValue: Animated.Value;
  frameData: TFrameData;
  frameCount: number;
  config?: Animated.InterpolationConfigType;
}): TInterpolations {
  const { animatedValue, frameData, frameCount, config } = params;
  const result: any = {};
  const inputRange = Array.from({ length: frameCount }, (_, i) => i);

  Object.keys(frameData).forEach((key) => {
    result[key] = animatedValue.interpolate({
      inputRange,
      outputRange: frameData[key] ?? [],
      ...config,
    });
  });

  return result;
}
