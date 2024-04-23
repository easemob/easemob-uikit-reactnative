import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  CreateGroup,
  DataModel,
  DataProfileProvider,
  GroupModel,
  UIListenerType,
  useChatContext,
} from 'react-native-chat-uikit';

import { RestApi } from '../common/rest.api';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateGroupScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const im = useChatContext();
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
            const groupId = result.value?.groupId;
            RestApi.requestGroupAvatar({ groupId: groupId })
              .then(async (res) => {
                if (res.isOk && res.value) {
                  im.updateDataList({
                    dataList: DataProfileProvider.toMap([
                      {
                        id: groupId,
                        avatar: res.value.avatarUrl,
                        type: 'group',
                      } as DataModel,
                    ]),
                    dispatchHandler: (data) => {
                      const d = {
                        groupId: groupId,
                        groupName: data.get(groupId)?.name,
                        groupAvatar: data.get(groupId)?.avatar,
                      } as GroupModel;
                      im.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', d);
                      return false;
                    },
                  });
                  // im.updateRequestData({
                  //   data: new Map([
                  //     [
                  //       'group',
                  //       [
                  //         {
                  //           id: groupId,
                  //           avatar: res.value.avatarUrl,
                  // type: 'group',
                  //         } as DataModel,
                  //       ],
                  //     ],
                  //   ]),
                  // });
                }
              })
              .catch((e) => {
                console.warn('requestGroupAvatar:', e);
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
