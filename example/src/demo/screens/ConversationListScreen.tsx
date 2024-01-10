import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ConversationList,
  ConversationListRef,
  DataModel,
  DataModelType,
  UIKitError,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationListScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ConversationList
        propsRef={convRef}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onRequestMultiData={async (params: {
          ids: Map<DataModelType, string[]>;
          result: (
            data?: Map<DataModelType, DataModel[]>,
            error?: UIKitError
          ) => void;
        }) => {
          const userIds = params.ids.get('user');
          const users = userIds?.map<DataModel>((id) => {
            return {
              id,
              name: id + 'name',
              // avatar: 'https://i.pravatar.cc/300',
              avatar:
                'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
              type: 'user' as DataModelType,
            };
          });
          const groupIds = params.ids.get('group');
          const groups = groupIds?.map<DataModel>((id) => {
            return {
              id,
              name: id + 'name',
              avatar:
                'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
              type: 'group' as DataModelType,
            };
          });
          params?.result(
            new Map([
              ['user', users ?? []],
              ['group', groups ?? []],
            ])
          );
        }}
        onClickedSearch={() => {
          navigation.push('SearchConversation', {});
        }}
        onClickedItem={(data) => {
          if (data === undefined) {
            return;
          }
          const convId = data?.convId;
          const convType = data?.convType;
          const convName = data?.convName;
          navigation.push('ConversationDetail', {
            params: {
              convId,
              convType,
              convName,
            },
          });
        }}
        onClickedNewGroup={() => {
          navigation.navigate('CreateGroup', {});
        }}
        onClickedNewConversation={() => {
          navigation.navigate('NewConversation', {});
        }}
        // onInitMenu={(menu: InitMenuItemsType[]) => {
        //   return [
        //     ...menu,
        //     {
        //       name: 'test',
        //       isHigh: false,
        //       icon: 'bell',
        //       onClickedItem: () => {
        //         console.log('test');
        //         const list = convRef.current.getList();
        //         const first = list[0];
        //         if (first) {
        //           convRef.current.updateItem({
        //             ...first,
        //             doNotDisturb: !first.doNotDisturb,
        //           });
        //         }
        //       },
        //     },
        //   ];
        // }}
        // onClickedNewContact={() => {
        // }}
      />
    </SafeAreaView>
  );
}
