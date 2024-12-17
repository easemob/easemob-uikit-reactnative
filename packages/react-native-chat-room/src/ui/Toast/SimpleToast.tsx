import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Queue, timeoutTask } from '../../utils';

export type SimpleToastTask = {
  message: string;
  timeout?: number;
};

export type SimpleToastRef = {
  show: (task: SimpleToastTask) => void;
};
export type SimpleToastProps = {
  propsRef: React.RefObject<SimpleToastRef>;
  timeout?: number;
};
export function SimpleToast(props: SimpleToastProps) {
  const { propsRef, timeout = 3000 } = props;
  const tasks: Queue<SimpleToastTask> = React.useRef(
    new Queue<SimpleToastTask>()
  ).current;
  const preTask = React.useRef<SimpleToastTask | undefined>(undefined);
  const curTask = React.useRef<SimpleToastTask | undefined>(undefined);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.barrage.onLight[3],
      dark: colors.barrage.onDark[3],
    },
    text: {
      light: colors.neutral[98],
      dark: colors.barrage.onDark[8],
    },
  });

  const [text, setText] = React.useState<string | undefined>(undefined);
  const [isShow, setIsShow] = React.useState(false);

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
    setIsShow(true);
    setText(curTask.current?.message ?? '');
    timeoutTask(curTask.current?.timeout ?? timeout, () => {
      preTask.current = curTask.current;
      curTask.current = undefined;
      onFinished?.();
    });
  };

  if (propsRef.current) {
    propsRef.current.show = (task: SimpleToastTask) => {
      tasks.enqueue(task);
      execTask();
    };
  }
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          justifyContent: 'center',
          alignItems: 'center',
          top: '70%',
          display: isShow === true ? 'flex' : 'none',
        },
      ]}
      pointerEvents={'none'}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: getColor('bg'),
        }}
      >
        <Text
          style={{
            maxWidth: '50%',
            color: getColor('text'),
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
