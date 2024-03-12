import * as React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import {
  BottomTabBar,
  Container,
  ConversationListItemProps,
  TabPage,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConversationListItemMemo } from '../../../../packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.item';
const array = Array.from({ length: 100 }, (_, index) => ({
  id: index.toString(),
}));
const testList = array.map((item) => {
  return {
    id: item.id,
    data: {
      convId: item.id,
      convType: 0,
      convAvatar: 'https://i.pravatar.cc/300',
      convName: 'user',
    },
  } as ConversationListItemProps;
});
export function CL() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'green',
        flex: 1,
      }}
    >
      <FlatList
        style={{
          flexGrow: 1,
        }}
        contentContainerStyle={{
          // flexGrow: 1,
          backgroundColor: 'yellow',
        }}
        data={testList}
        renderItem={(info: ListRenderItemInfo<ConversationListItemProps>) => {
          const { item } = info;
          return <ConversationListItemMemo {...item} />;
        }}
        keyExtractor={(item: ConversationListItemProps) => {
          return item.id;
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
    <View style={{ flex: 1 }}>
      <FlatList
        style={{
          flexGrow: 1,
        }}
        contentContainerStyle={{
          // flexGrow: 1,
          backgroundColor: 'yellow',
        }}
        data={testList}
        renderItem={(info: ListRenderItemInfo<ConversationListItemProps>) => {
          const { item } = info;
          return <ConversationListItemMemo {...item} />;
        }}
        keyExtractor={(item: ConversationListItemProps) => {
          return item.id;
        }}
      />
    </View>
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

/**
 * How to correctly set FlatList component height.
 * 1. Wrap a View component around the FlatList component.
 * 2. Set View component style flex=1
 * 3.Set the FlatList component style flexGrow = 1
 */
export default function TestFlatListRn() {
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
