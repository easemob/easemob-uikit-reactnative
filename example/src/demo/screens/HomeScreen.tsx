import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  BottomTabBar,
  ContactList,
  ConversationList,
  DataModel,
  DataModelType,
  TabPage,
  UIKitError,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function HomeScreen(props: Props) {
  const {} = props;
  return (
    <SafeAreaView
      style={
        {
          // backgroundColor: 'red',
        }
      }
    >
      <TabPage
        header={{
          Header: BottomTabBar as any,
          HeaderProps: {
            titles: ['1', '2', '3'],
            items: [
              {
                title: 'tab_conv_list',
                icon: 'bubble_fill',
              },
              {
                title: 'tab_contact_list',
                icon: 'person_double_fill',
              },
              {
                title: 'tab_mine',
                icon: 'person_single_fill',
              },
            ],
          } as any,
        }}
        // body={{
        //   type: 'TabPageBodyT',
        //   BodyProps: {
        //     RenderChildren: BodyPagesT,
        //     RenderChildrenProps: {
        //       index: 0,
        //       currentIndex: 0,
        //     },
        //   },
        // }}
        body={{
          type: 'TabPageBodyLIST',
          BodyProps: {
            RenderChildren: [
              HomeTabConversationListScreen,
              HomeTabContactListScreen,
              BodyPagesLIST,
            ],
            RenderChildrenProps: {
              index: 0,
              currentIndex: 0,
            },
          },
        }}
        headerPosition="down"
        initIndex={0}
        onCurrentIndex={(index) => {
          console.log('test:zuoyu:index', index);
        }}
      />
    </SafeAreaView>
  );
}

export function BodyPagesT({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  console.log('test:BodyPagesT:', index, currentIndex);
  if (index === 0) {
    return <HomeTabConversationListScreen />;
  } else if (index === 1) {
    return <HomeTabContactListScreen />;
  } else if (index === 2) {
    return <View style={{ flexGrow: 1, backgroundColor: 'red' }} />;
  }
  return <View />;
}

export function BodyPagesLIST({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  console.log('test:BodyPagesLIST:', index, currentIndex);
  return <View style={{ flexGrow: 1, backgroundColor: 'red' }} />;
}

type HomeTabConversationListScreenProps = {};
function HomeTabConversationListScreen(
  props: HomeTabConversationListScreenProps
) {
  const {} = props;
  const { navigation } =
    useNavigation<NativeStackScreenProps<RootScreenParamsList>>();

  return (
    <ConversationList
      containerStyle={{
        flexGrow: 1,
        // backgroundColor: 'red',
      }}
      onRequestData={(params: {
        ids: string[];
        result: (data?: DataModel[], error?: UIKitError) => void;
      }) => {
        params?.result([{ id: 'xx', name: 'test', avatar: '' }]);
      }}
      onRequestMultiData={(params: {
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
          };
        });
        const groupIds = params.ids.get('group');
        const groups = groupIds?.map<DataModel>((id) => {
          return {
            id,
            name: id + 'name',
            avatar:
              'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
          };
        });
        params?.result(
          new Map([
            ['user', users ?? []],
            ['group', groups ?? []],
          ])
        );
      }}
      onSearch={() => {
        navigation.push('SearchConversation', {});
      }}
      onClicked={(data) => {
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
    />
  );
}
export type HomeTabContactListScreenProps = {};
function HomeTabContactListScreen(props: HomeTabContactListScreenProps) {
  const {} = props;
  const { navigation } =
    useNavigation<NativeStackScreenProps<RootScreenParamsList>>();

  return (
    <ContactList
      contactType={'contact-list'}
      containerStyle={{
        flexGrow: 1,
        // backgroundColor: 'red',
      }}
      onRequestData={(params: {
        ids: string[];
        result: (data?: DataModel[], error?: UIKitError) => void;
      }) => {
        const userIds = params.ids;
        const users = userIds.map((v) => {
          return {
            id: v,
            name: v + 'name',
            avatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
          };
        });
        params.result(users ?? []);
      }}
      onSearch={() => {
        navigation.navigate('SearchContact', {
          params: { searchType: 'contact-list' },
        });
      }}
      onClickedNewGroup={() => {
        navigation.navigate('CreateGroup', {
          params: { searchType: 'create-group' },
        });
      }}
      onClickedNewConversation={() => {
        navigation.navigate('NewConversation', {
          params: { searchType: 'new-conversation' },
        });
      }}
      onClicked={(data) => {
        if (data?.userId) {
          navigation.push('ContactInfo', { params: { userId: data.userId } });
        }
      }}
    />
  );
}
