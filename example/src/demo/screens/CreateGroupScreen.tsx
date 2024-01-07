import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  CreateGroup,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateGroupScreen(props: Props) {
  const { navigation, route } = props;
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
          if (result.isOk === true) {
            navigation.pop();
            navigation.navigate('ConversationDetail', {
              params: {
                convId: result.value?.groupId,
                convType: 1,
                convName: result.value?.groupName,
              },
            });
          } else {
            navigation.goBack();
          }
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
