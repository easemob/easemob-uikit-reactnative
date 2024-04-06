import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  CreateGroup,
  DataModel,
  useChatContext,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RestApi } from '../common/rest.api';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateGroupScreen(props: Props) {
  const { navigation, route } = props;
  const im = useChatContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <CreateGroup
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onClickedSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'create-group' },
          });
        }}
        selectedData={data}
        onCreateGroupResult={(result) => {
          if (result.isOk === true && result.value) {
            navigation.pop();
            navigation.navigate('ConversationDetail', {
              params: {
                convId: result.value?.groupId,
                convType: 1,
                convName: result.value?.groupName ?? result.value?.groupId,
                from: 'CreateGroup',
                hash: Date.now(),
              },
            });
            const groupId = result.value?.groupId;
            RestApi.reqGetGroupAvatar({ groupId: groupId })
              .then(async (res) => {
                if (res.isOk && res.value) {
                  im.updateRequestData({
                    data: new Map([
                      [
                        'group',
                        [
                          {
                            id: groupId,
                            avatar: res.value.avatarUrl,
                          } as DataModel,
                        ],
                      ],
                    ]),
                  });
                }
              })
              .catch((e) => {
                console.warn('reqGetGroupAvatar:', e);
              });
          } else {
            navigation.goBack();
          }
        }}
        onBack={() => {
          navigation.goBack();
        }}
        // onGetGroupName={() => 'test create group'}
      />
    </SafeAreaView>
  );
}
