import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { GroupList } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupListScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  return (
    <SafeAreaViewFragment>
      <GroupList
        onClickedSearch={() => {
          navi.push({ to: 'SearchGroup' });
        }}
        onClickedItem={(data) => {
          if (data) {
            navi.push({ to: 'GroupInfo', props: { groupId: data.groupId } });
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
