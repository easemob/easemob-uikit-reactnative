import * as React from 'react';
import {
  BottomTabBar,
  Container,
  ConversationList,
  DataModel,
  DataModelType,
  SearchConversation,
  TabPage,
  UIKitError,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CL() {
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ConversationList
        testMode={'only-ui'}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onRequestData={(params: {
          ids: string[];
          result: (data?: DataModel[], error?: UIKitError) => void;
        }) => {
          console.log('test:zuoyu:onRequestData', params);
          const users = params.ids?.map<DataModel>((id) => {
            return {
              id,
              name: id + 'name',
              // avatar: 'https://i.pravatar.cc/300',
              avatar:
                'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            };
          });
          params?.result(users ?? []);
        }}
        onRequestMultiData={(params: {
          ids: Map<DataModelType, string[]>;
          result: (
            data?: Map<DataModelType, DataModel[]>,
            error?: UIKitError
          ) => void;
        }) => {
          console.log('test:zuoyu:onRequestMultiData', params);
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
      />
    </SafeAreaView>
  );
}

export function CL3() {
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <SearchConversation
        testMode={'only-ui'}
        onCancel={() => {
          console.log('test:zuoyu:cancel');
        }}
        onClicked={(data) => {
          console.log('test:zuoyu:clicked:', data);
        }}
        containerStyle={{
          backgroundColor: 'red',
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
  return (
    <ConversationList
      testMode={'only-ui'}
      containerStyle={{
        flexGrow: 1,
        backgroundColor: 'green',
      }}
    />
  );
}

export function CL2() {
  return (
    <SafeAreaView>
      <TabPage
        header={{
          Header: BottomTabBar as any,
          HeaderProps: {
            titles: ['1', '2', '3'],
            items: [
              {
                title: '会话',
                icon: 'bubble_fill',
              },
              {
                title: '联系人',
                icon: 'person_double_fill',
              },
              {
                title: '我',
                icon: 'person_single_fill',
              },
            ],
          } as any,
        }}
        body={{
          type: 'TabPageBodyT',
          BodyProps: {
            RenderChildren: BodyPagesT,
            RenderChildrenProps: {
              index: 0,
              currentIndex: 0,
            },
          },
        }}
        headerPosition="down"
        initIndex={2}
        onCurrentIndex={(index) => {
          console.log('test:zuoyu:index', index);
        }}
      />
    </SafeAreaView>
  );
}

export default function TestConversationList() {
  return (
    <Container appKey={''}>
      <CL3 />
    </Container>
  );
}
