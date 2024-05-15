import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { BlockList } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function BlockListScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  return (
    <SafeAreaViewFragment>
      <BlockList
        onClickedSearch={() => {
          navi.push({ to: 'SearchBlock' });
        }}
        onClickedItem={(data) => {
          if (data) {
            navi.push({ to: 'ContactInfo', props: { userId: data.userId } });
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
