import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function FileMessagePreviewScreen(props: Props) {
  const {} = props;
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    />
  );
}
