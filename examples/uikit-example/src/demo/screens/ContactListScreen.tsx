import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ContactList,
  // DataModel,
  // DataModelType,
  // UIKitError,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { generateRandomChineseNames } from '../common/names';
import type { RootScreenParamsList } from '../routes';

export const names = generateRandomChineseNames(10);

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactListScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  // const im = useChatContext();
  // const updateData = React.useCallback(async () => {
  //   im.getAllContacts({
  //     onResult: (result) => {
  //       if (result.isOk && result.value) {
  //         const users: DataModel[] = [];
  //         result.value.forEach((conv) => {
  //           if (conv.userId === ChatConversationType.PeerChat) {
  //             users.push({ id: conv.userId, type: 'user', name: 'xxx' });
  //           }
  //         });
  //         im.updateRequestData({
  //           data: new Map([['user', users ?? []]]),
  //         });
  //       }
  //     },
  //   });
  // }, [im]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactList
        contactType={'contact-list'}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        // navigationBarVisible={false}
        // onInitialized={updateData}
        // onRequestMultiData={async (params: {
        //   ids: Map<DataModelType, string[]>;
        //   result: (
        //     data?: Map<DataModelType, DataModel[]>,
        //     error?: UIKitError
        //   ) => void;
        // }) => {
        //   const userIds = params.ids.get('user');
        //   const users = userIds?.map<DataModel>((id) => {
        //     return {
        //       id,
        //       name: id + 'name',
        //       // avatar: 'https://i.pravatar.cc/300',
        //       avatar:
        //         'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //       type: 'user' as DataModelType,
        //     };
        //   });
        //   const groupIds = params.ids.get('group');
        //   const groups = groupIds?.map<DataModel>((id) => {
        //     return {
        //       id,
        //       name: id + 'name',
        //       avatar:
        //         'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
        //       type: 'group' as DataModelType,
        //     };
        //   });
        //   params?.result(
        //     new Map([
        //       ['user', users ?? []],
        //       ['group', groups ?? []],
        //     ])
        //   );
        // }}
        onClickedSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'contact-list' },
          });
        }}
        onClickedItem={(data) => {
          if (data?.userId) {
            navigation.push('ContactInfo', { params: { userId: data.userId } });
          }
        }}
        onClickedGroupList={() => {
          navigation.navigate('GroupList', {
            params: {},
          });
        }}
        onClickedNewRequest={() => {
          navigation.navigate('NewRequests', {
            params: {},
          });
        }}
        // NavigationBar={
        //   <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />
        // }
        // enableNavigationBar={true}
        // onClickedNewContact={() => {}}
      />
    </SafeAreaView>
  );
}
