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
  /**
   * Callback notification when the value changes.
   */
  onChanged?: (value: number) => void;
};
export function TimerText(props: TimerTextProps) {
  const { isIncrease, startValue, stopValue, propsRef, textStyle, onChanged } =
    props;
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
      onChanged?.(startValue);
    };
  }
  const start = () => {
    timerRef.current = setInterval(() => {
      if (isIncrease === true) {
        setValue((v) => {
          // onChanged?.(v + 1); // !!! Warning: Cannot update a component (`VoiceBar`) while rendering a different component (`TimerText`). To locate the bad setState() call inside `TimerText`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
          return v + 1;
        });
      } else {
        setValue((v) => {
          // onChanged?.(v - 1);
          return v - 1;
        });
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
  React.useEffect(() => {
    onChanged?.(value);
  }, [onChanged, value]);
  return <Text {...textStyle}>{value}</Text>;
}
