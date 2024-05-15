import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { SearchBlock } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchBlockScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  return (
    <SafeAreaViewFragment>
      <SearchBlock
        onCancel={() => {
          navi.goBack();
        }}
        onClicked={(data) => {
          if (data) {
            navi.navigate({
              to: 'ContactInfo',
              props: {
                userId: data.userId,
              },
            });
          }
        }}
      />
    </SafeAreaViewFragment>
  );
}
