import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  DataModel,
  DataModelType,
  GroupParticipantList,
  UIKitError,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { navigation, route } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <GroupParticipantList
        groupId={groupId}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onRequestGroupData={(params: {
          groupId: string;
          ids: string[];
          result: (data?: DataModel[], error?: UIKitError) => void;
        }) => {
          params?.result(
            params.ids.map((v) => {
              return {
                id: v,
                name: v + 'name',
                avatar:
                  'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
                type: 'user' as DataModelType,
              };
            })
          );
        }}
        onClickedSearch={() => {
          navigation.push('GroupParticipantList', {});
        }}
        onClickedItem={(data) => {
          if (data) {
            navigation.push('GroupParticipantInfo', {
              params: {
                groupId: groupId,
                userId: data.memberId,
              },
            });
          }
        }}
        onClickedAddParticipant={() => {
          navigation.push('AddGroupParticipant', { params: { groupId } });
        }}
        onClickedDelParticipant={() => {
          navigation.push('DelGroupParticipant', { params: { groupId } });
        }}
        onBack={() => {
          navigation.goBack();
        }}
        onKicked={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
