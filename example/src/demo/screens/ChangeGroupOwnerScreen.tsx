import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChangeGroupOwner } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChangeGroupOwnerScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const groupId = ((route.params as any)?.params as any)?.groupId;

  return (
    <SafeAreaViewFragment>
      <ChangeGroupOwner
        groupId={groupId}
        onBack={() => {
          navi.goBack();
        }}
        onChangeResult={(data) => {
          navi.goBack({
            props: { groupId, ownerId: data.value },
          });
        }}
      />
    </SafeAreaViewFragment>
  );
}
