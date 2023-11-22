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
          params?.result([{ id: 'xx', name: 'test', avatar: '' }]);
        }}
        onRequestMultiData={(params: {
          ids: Map<DataModelType, string[]>;
          result: (
            data?: Map<DataModelType, DataModel[]>,
            error?: UIKitError
          ) => void;
        }) => {
          console.log('test:zuoyu:onRequestMultiData', params);
          params?.result(
            new Map([
              ['user', [{ id: 'xx', name: 'xx', avatar: '' }]],
              ['group', [{ id: 'yy', name: 'yy', avatar: '' }]],
            ])
          );
        }}
      />
    </SafeAreaView>
  );
}

export function CL3() {
  return (
    <SafeAreaView>
      <SearchConversation
        testMode={'only-ui'}
        onCancel={() => {
          console.log('test:zuoyu:cancel');
        }}
        containerStyle={{
          height: '100%',
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
      <CL />
    </Container>
  );
}
