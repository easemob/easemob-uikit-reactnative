import * as React from 'react';

import { Text, TextProps } from './Text';

export type TimerTextRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};
export type TimerTextProps = {
  /**
   * Does the number increase or decrease.
   */
  isIncrease: boolean;
  /**
   * The start value of the timer.
   */
  startValue: number;
  /**
   * The stop value of the timer.
   */
  stopValue: number;
  /**
   * The ref of the timer.
   */
  propsRef: React.RefObject<TimerTextRef>;
  /**
   * The style of the text.
   */
  textStyle?: TextProps;
};
export function TimerText(props: TimerTextProps) {
  const { isIncrease, startValue, stopValue, propsRef, textStyle } = props;
  const [value, setValue] = React.useState(startValue);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  if (propsRef?.current) {
    propsRef.current.start = () => {
      start();
    };
    propsRef.current.stop = () => {
      stop();
    };
    propsRef.current.reset = () => {
      setValue(startValue);
    };
  }
  const start = () => {
    timerRef.current = setInterval(() => {
      if (isIncrease === true) {
        setValue((v) => v + 1);
      } else {
        setValue((v) => v - 1);
      }
    }, 1000);
  };
  const stop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  React.useEffect(() => {
    return () => {
      stop();
    };
  }, []);
  React.useEffect(() => {
    if (value === stopValue) {
      stop();
    }
  }, [stopValue, value]);
  return <Text {...textStyle}>{value}</Text>;
}
