import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { CreateGroup } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateGroupScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const data = ((route.params as any)?.params as any)?.data;
  return (
    <SafeAreaViewFragment>
      <CreateGroup
        onClickedSearch={() => {
          navi.navigate({
            to: 'SearchContact',
            props: {
              searchType: 'create-group',
            },
          });
        }}
        selectedData={data}
        onCreateGroupResult={(result) => {
          if (result.isOk === true && result.value) {
            navi.navigation.pop();
            navi.navigate({
              to: 'ConversationDetail',
              props: {
                convId: result.value?.groupId,
                convType: 1,
                convName: result.value?.groupName ?? result.value?.groupId,
              },
            });
          } else {
            navi.goBack();
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
        // onGetGroupName={() => 'test create group'}
      />
    </SafeAreaViewFragment>
  );
}
