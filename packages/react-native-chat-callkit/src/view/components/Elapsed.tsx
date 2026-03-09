import * as React from 'react';
import { Text, View } from 'react-native';

import { formatElapsed } from '../../utils/utils';

type ElapsedProps = {
  timer: number; // second unit
  color?: string;
};
export const ElapsedInternal = (props: ElapsedProps): React.ReactNode => {
  const { timer, color } = props;
  const [elapsed, setElapsed] = React.useState(timer);
  const elapsedRef = React.useRef(elapsed);
  const updateTime = React.useCallback(() => {
    return setInterval(() => {
      setElapsed(elapsedRef.current + 1000);
      elapsedRef.current = elapsedRef.current + 1000;
    }, 1000);
  }, []);
  React.useEffect(() => {
    const id = updateTime();
    return () => {
      clearInterval(id);
    };
  }, [updateTime]);
  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          lineHeight: 22,
          fontWeight: '400',
          textAlign: 'center',
          color: color ?? 'black',
        }}
      >
        {formatElapsed(elapsed)}
      </Text>
    </View>
  );
};

export const Elapsed = React.memo((props: ElapsedProps) => {
  return <ElapsedInternal {...props} />;
});
