import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { getElement } from '../../hook';
import { Queue, timeoutTask } from '../../utils';
import type { ToastViewProps, ToastViewTask } from './types';

export function ToastView(props: ToastViewProps) {
  const { propsRef, timeout = 3000, showPosition } = props;
  const tasks: Queue<ToastViewTask> = React.useRef(
    new Queue<ToastViewTask>()
  ).current;
  const preTask = React.useRef<ToastViewTask | undefined>(undefined);
  const curTask = React.useRef<ToastViewTask | undefined>(undefined);

  const [view, setView] = React.useState<React.ReactElement | undefined | null>(
    undefined
  );
  const [isShow, setIsShow] = React.useState(false);
  const showPositionRef = React.useRef(showPosition);

  const getPositionStyle = React.useCallback(() => {
    switch (showPositionRef.current) {
      case 'top':
        return '10%';
      case 'center':
        return '50%';
      case 'bottom':
        return '90%';
      default:
        return '70%';
    }
  }, []);

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        execAnimation(() => {
          execTask();
        });
      } else {
        setIsShow(false);
      }
    }
  };

  const execAnimation = (onFinished?: () => void) => {
    if (curTask.current?.showPosition) {
      showPositionRef.current = curTask.current.showPosition;
    } else {
      if (showPosition) {
        showPositionRef.current = showPosition;
      }
    }
    setIsShow(true);
    const view = getElement(curTask.current?.children);
    setView(view);
    timeoutTask(curTask.current?.timeout ?? timeout, () => {
      preTask.current = curTask.current;
      curTask.current = undefined;
      onFinished?.();
    });
  };

  if (propsRef.current) {
    propsRef.current.show = (task: ToastViewTask) => {
      tasks.enqueue(task);
      execTask();
    };
  }
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          // justifyContent: 'center',
          alignItems: 'center',
          top: getPositionStyle(),
          display: isShow === true ? 'flex' : 'none',
        },
      ]}
      pointerEvents={'none'}
    >
      {view}
    </View>
  );
}
