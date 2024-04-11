import * as React from 'react';
import {
  BottomTabBar,
  ContactList,
  Container,
  SearchContact,
  TabPage,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CL() {
  return (
    <SafeAreaView>
      <ContactList
        testMode={'only-ui'}
        contactType={'new-conversation'}
        containerStyle={{
          height: '100%',
          // backgroundColor: 'yellow',
        }}
        // onRequestData={(params: {
        //   ids: string[];
        //   result: (data?: DataModel[], error?: UIKitError) => void;
        // }) => {
        //   params?.result(
        //     params.ids.map((v) => {
        //       return {
        //         id: v,
        //         name: v + 'name',
        //         avatar:
        //           'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //         type: 'user' as DataModelType,
        //       };
        //     })
        //   );
        // }}
        // onRequestMultiData={(params: {
        //   ids: Map<DataModelType, string[]>;
        //   result: (
        //     data?: Map<DataModelType, DataModel[]>,
        //     error?: UIKitError
        //   ) => void;
        // }) => {
        //   console.log('test:zuoyu:onRequestMultiData', params);
        //   params?.result(
        //     new Map([
        //       [
        //         'user',
        //         [
        //           {
        //             id: 'xx',
        //             name: 'xx',
        //             avatar: '',
        //             type: 'user' as DataModelType,
        //           },
        //         ],
        //       ],
        //       [
        //         'group',
        //         [
        //           {
        //             id: 'yy',
        //             name: 'yy',
        //             avatar: '',
        //             type: 'group' as DataModelType,
        //           },
        //         ],
        //       ],
        //     ])
        //   );
        // }}
        // onClicked={(data) => {
        //   console.log('test:zuoyu:onClicked', data);
        // }}
      />
    </SafeAreaView>
  );
}

export function CL3() {
  return (
    <SafeAreaView>
      <SearchContact
        searchType={'contact-list'}
        onCancel={() => {
          console.log('test:zuoyu:cancel');
        }}
        containerStyle={{
          height: '100%',
          backgroundColor: 'yellow',
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
  // const color = (i: number) => {
  //   if (i === 0) {
  //     return ['blue', 'red'];
  //   } else if (i === 1) {
  //     return ['orange', 'yellow'];
  //   } else if (i === 2) {
  //     return ['yellow', 'gray'];
  //   } else if (i === 3) {
  //     return ['red', 'yellow'];
  //   }
  //   return [];
  // };
  return (
    <ContactList
      contactType={'contact-list'}
      containerStyle={{
        // height: '100%',
        backgroundColor: 'green',
      }}
    />
  );
  // return (
  //   <TabPageBodyItem
  //     key={index}
  //     style={{
  //       backgroundColor: color(index)[0],
  //       // height: 100,
  //       // flexGrow: 1,
  //     }}
  //   >
  //     <ContactList />
  //   </TabPageBodyItem>
  // );
}

export function CL2() {
  return (
    <SafeAreaView>
      <TabPage
        // header={{
        //   // Header: TabPage.DefaultHeader,
        //   HeaderProps: {
        //     titles: ['1', '2', '3', '4'],
        //   },
        // }}
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
        // body={{
        //   type: 'TabPageBody',
        //   // Body: TabPage.DefaultBody,
        //   BodyProps: {
        //     children: BodyPages(),
        //   },
        // }}
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
        // height={300}
        // height={undefined}
        // width={300}
        headerPosition="down"
        initIndex={2}
        onCurrentIndex={(index) => {
          console.log('test:zuoyu:index', index);
        }}
      />
    </SafeAreaView>
  );
}

export default function TestContactList() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <CL />
    </Container>
  );
}
