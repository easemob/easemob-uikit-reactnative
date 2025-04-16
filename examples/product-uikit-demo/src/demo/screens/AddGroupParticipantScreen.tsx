import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddGroupParticipant } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AddGroupParticipantScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaViewFragment>
      <AddGroupParticipant
        onClickedSearch={() => {
          navi.navigate({
            to: 'SearchContact',
            props: {
              searchType: 'add-group-member',
              groupId,
            },
          });
        }}
        selectedData={data}
        groupId={groupId}
        onAddedResult={() => {
          console.log('onAddedResult');
          navi.goBack();
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
