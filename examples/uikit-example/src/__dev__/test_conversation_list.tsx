import * as React from 'react';
import {
  BottomTabBar,
  ContactList,
  Container,
  ConversationList,
  SearchConversation,
  TabPage,
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
        // onRequestData={(params: {
        //   ids: string[];
        //   result: (data?: DataModel[], error?: UIKitError) => void;
        // }) => {
        //   console.log('test:zuoyu:onRequestData', params);
        //   const users = params.ids?.map<DataModel>((id) => {
        //     return {
        //       id,
        //       name: id + 'name',
        //       // avatar: 'https://i.pravatar.cc/300',
        //       avatar:
        //         'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //       type: 'user' as DataModelType,
        //     };
        //   });
        //   params?.result(users ?? []);
        // }}
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
  if (index === 0) {
    return (
      <ConversationList
        testMode={'only-ui'}
        containerStyle={{
          flexGrow: 1,
          backgroundColor: 'green',
        }}
      />
    );
  } else if (index === 1) {
    return (
      <ContactList
        testMode={'only-ui'}
        containerStyle={{
          flexGrow: 1,
          backgroundColor: 'blue',
        }}
        contactType={'contact-list'}
      />
    );
  }
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
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <CL2 />
    </Container>
  );
}
