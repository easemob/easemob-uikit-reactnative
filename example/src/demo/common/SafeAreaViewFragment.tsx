import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBackgroundColor } from '../hooks';

type Props = React.PropsWithChildren<{}>;
export function SafeAreaViewFragment(props: Props) {
  const { children } = props;
  const { getBackgroundColor } = useBackgroundColor();
  return (
    <SafeAreaView
      style={{
        backgroundColor: getBackgroundColor('bg'),
        flex: 1,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
