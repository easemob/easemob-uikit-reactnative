import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { NewRequests } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewRequestScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);

  return (
    <SafeAreaViewFragment>
      <NewRequests
        onClickedItem={(data) => {
          if (data?.requestId) {
            navi.push({ to: 'ContactInfo', props: { userId: data.requestId } });
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
