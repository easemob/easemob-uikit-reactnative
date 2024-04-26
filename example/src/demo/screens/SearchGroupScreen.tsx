import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { SearchGroup } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchGroupScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  return (
    <SafeAreaViewFragment>
      <SearchGroup
        onCancel={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
