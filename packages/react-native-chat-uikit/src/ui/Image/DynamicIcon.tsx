import * as React from 'react';

import type { IconNameType } from '../../assets';
import { Image, type ImageProps } from './Image';
import { getIconSource } from './Image.hooks';
import type { IconResolutionType } from './types';

export const gFrameInterval = 330; // ms

export type DynamicIconRef = {
  startPlay: () => void;
  stopPlay: () => void;
};
export type DynamicIconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  propsRef?: React.RefObject<DynamicIconRef>;
  names: (IconNameType | number)[];
  resolution?: IconResolutionType;
  /**
   * Animation playback interval, in milliseconds.
   */
  frameInterval?: number;
  /**
   * Whether to loop playback, default is -1.
   */
  loopCount?: number;
  /**
   * The index of the initial playback frame, the default is 0.
   */
  initialIndex?: number;
  onPlayStart?: () => void;
  onPlayFinished?: () => void;
};

export function DynamicIcon(props: DynamicIconProps) {
  const {
    propsRef,
    frameInterval = gFrameInterval,
    names,
    resolution = '',
    style,
    loopCount = -1,
    initialIndex = 0,
    onPlayStart,
    onPlayFinished,
    ...others
  } = props;
  const [source, setSource] = React.useState<number | undefined>(
    getIconSource(names[initialIndex], resolution)
  );
  const timerRef = React.useRef<NodeJS.Timer>();
  if (propsRef?.current) {
    propsRef.current.startPlay = () => {
      onPlayStart?.();
      start();
    };
    propsRef.current.stopPlay = () => {
      stop();
      onPlayFinished?.();
    };
  }

  const stop = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
      setSource(getIconSource(names[initialIndex], resolution));
    }
  }, [initialIndex, names, resolution]);

  const start = React.useCallback(() => {
    let index = initialIndex;
    let currentLoopCount = 0;
    timerRef.current = setInterval(() => {
      index++;
      ++currentLoopCount;
      if (index >= names.length) {
        if (loopCount !== -1) {
          if (currentLoopCount >= loopCount) {
            stop();
            onPlayFinished?.();
            return;
          }
        }
        index = 0;
      }
      setSource(getIconSource(names[index], resolution));
    }, frameInterval);
  }, [
    initialIndex,
    frameInterval,
    names,
    resolution,
    loopCount,
    onPlayFinished,
    stop,
  ]);

  return <Image source={source ?? 0} style={[style]} {...others} />;
}
