[Return to Parent Document](./index.en.md)

- [Introduction to Examples](#introduction-to-examples)
  - [Project Configuration](#project-configuration)
  - [Project Compilation](#project-compilation)
  - [Initialization](#initialization)
  - [Routing](#routing)
    - [How to Register Pages](#how-to-register-pages)
    - [How to Switch Pages](#how-to-switch-pages)
  - [Pages](#pages)
    - [Page Structure](#page-structure)
    - [List Components](#list-components)
    - [Detail Components](#detail-components)
    - [Chat Component](#chat-component)
  - [Data Management](#data-management)
  - [FAQ](#faq)

# Introduction to Examples

This example project demonstrates the usage of `uikit`. For the configuration, compilation, and dependencies of the project, see other documents. Here we mainly introduce how to use each component.

Since the `uikit` does not include the routing functionality, we describe this function in details.

The core parts of `uikit` mainly include configuration initialization, conversation list page, contact list page, group list page, group participant list page, chat page, contact detail page, group detail page, and related components. These components are all used in this example project. It also uses tools such as themes, internationalization, and the audio and video call component libraries. The `AppServer` tool is also used as a service for login and information retrieval. In addition to out-of-the-box page-level components, basic components are also provided to make it easier to build more complex components to facilitate business development.

## Project Configuration

Refer to the `existed-app` section.

In addition, it is important to note that this project is a local dependency, which means it will automatically use the local npm package provided in the repository.

## Project Compilation

The project is a subdirectory of the repository. You need to initialize the repository before building the project.

```sh
# In the root directory.
yarn
# Initialize configuration, generate files like version.ts, env.ts, config.local.ts, and fill in the necessary parameters.
yarn yarn-prepack
# Switch to the subdirectory
cd examples/uikit-example
# For the iOS platform, run the following command:
cd ios && pod install
# For the android platform, run the sync of the android project:
```

You need to fill in necessary parameters, for example: `appKey`, in the generated file `env.ts`.

## Initialization

The project configuration is very important and is usually completed in the early phase of the program's runtime.

An example is shown below:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { Container as UIKitContainer } from 'react-native-chat-uikit';
export function App() {
  // ...
  return (
    <UIKitContainer
      options={{
        appKey: gAppKey,
      }}
    >
      <NavigationContainer>
        <Root.Navigator initialRouteName={initialRouteName}>
          <Root.Screen
            name={'Home'}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
            component={HomeScreen}
          />
          {/* More pages */}
        </Root.Navigator>
      </NavigationContainer>
    </UIKitContainer>
  );
}
```

For the detailed usage, please refer to `examples/uikit-example/src/demo/App.tsx`.

## Routing

### How to Register Pages

This example project uses the third-party library `react-navigation` for page-level routing management. `react-native` does not provide the built-in routing functionality.

Here is an example of registering pages:

```tsx
import { NavigationContainer } from '@react-navigation/native';
export function App() {
  return (
    <NavigationContainer>
      <Root.Navigator initialRouteName={'Home'}>
        <Root.Screen
          name={'Home'}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          component={HomeScreen}
        />
        {/* More page registrations */}
      </Root.Navigator>
    </NavigationContainer>
  );
}
```

### How to Switch Pages

The common way to switch routes is to navigate from page A to page B. For example:

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationListScreen(props: Props) {
  const { navigation } = props;
  return (
    <ConversationList
      onClickedNewGroup={() => {
        navigation.push('CreateGroup', {});
      }}
      onClickedNewConversation={() => {
        navigation.navigate('NewConversation', {});
      }}
    />
  );
}
```

## Pages

There are not many core page components, but they provide a variety of customization interfaces.

### Page Structure

In the core pages, the list components include the conversation list, contact list, group list, and group participant list. The detail components include contact detail and group detail.

### List Components

This type of component mainly consists of a navigation bar component, a search component, and a list component. The navigation bar can be displayed, hidden, or customized. The search component, upon a click, navigates to the search page of the component, allowing you to retrieve the current content of the page. The list component displays the current content.

List components:

- ConversationList: `packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.tsx` [source code](../../../packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.tsx)
- ContactList: `packages/react-native-chat-uikit/src/biz/ContactList/ContactList.tsx` [source code](../../../packages/react-native-chat-uikit/src/biz/ContactList/ContactList.tsx)
- GroupList: `packages/react-native-chat-uikit/src/biz/GroupList/GroupList.tsx` [source code](../../../packages/react-native-chat-uikit/src/biz/GroupList/GroupList.tsx)
- GroupParticipantList: `packages/react-native-chat-uikit/src/biz/GroupParticipantList/GroupParticipantList.tsx` [source code](../../../packages/react-native-chat-uikit/src/biz/GroupParticipantList/GroupParticipantList.tsx)

Among them, the contact list component is a reusable component that can be used as needed. For example: displaying the contact list, or using it on the user selection page during group creation. For example:

```tsx
// Contact list page
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactList
        contactType={'contact-list'}
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
      />
    </SafeAreaView>
  );
}
```

```tsx
// Namecard sharing page
export function ShareContact(props: ShareContactProps) {
  return <ContactList contactType={'share-contact'} {...props} />;
}
```

### Detail Components

When a user avatar or group avatar is clicked, the detail component page can be opened.

Detail components include:

- ContactInfo: `packages/react-native-chat-uikit/src/biz/Info/ContactInfo.tsx` [source code](../../../packages/react-native-chat-uikit/src/biz/Info/ContactInfo.tsx)
- GroupInfo: `packages/react-native-chat-uikit/src/biz/Info/GroupInfo.tsx` [source code](../../../packages/react-native-chat-uikit/src/biz/Info/GroupInfo.tsx)

This type of component consists of a navigation bar component, an avatar component, and a single-item list component. The navigation bar can be displayed, hidden, or customized. Other parts can be modified and displayed.

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { navigation, route } = props;
  const { tr } = useI18nContext();
  const userId = ((route.params as any)?.params as any)?.userId;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const contactRef = React.useRef<any>({} as any);

  const listener = React.useMemo<ChatServiceListener>(() => {
    return {
      onContactDeleted: (userId: string): void => {
        console.log(`onContactDeleted: ${userId}`);
        navigation.goBack();
      },
    } as ChatServiceListener;
  }, [navigation]);
  useChatListener(listener);

  const goback = (data: string) => {
    if (data) {
      contactRef.current?.setContactRemark?.(userId, data);
    }
  };
  const testRef = React.useRef<(data: any) => void>(goback);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactInfo
        ref={contactRef}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        userId={userId}
        onSendMessage={() => {
          navigation.navigate('ConversationDetail', {
            params: {
              convId: userId,
              convType: 0,
              convName: userId,
              from: 'ContactInfo',
              hash: Date.now(),
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
        onClickedContactRemark={(userId, remark) => {
          console.log(`onClickedContactRemark: ${userId}, ${remark}`);
          navigation.push('EditInfo', {
            params: {
              backName: tr('_demo_edit_contact_remark'),
              saveName: tr('done'),
              initialData: remark,
              maxLength: 128,
              from: 'ContactInfo',
              hash: Date.now(),
              testRef,
            },
          });
        }}
        onSearch={(id) => {
          navigation.push('MessageSearch', {
            params: { convId: id, convType: 0 },
          });
        }}
      />
    </SafeAreaView>
  );
}
```

### Chat Component

The chat components mainly include chat mode, search mode, topic creation mode, and topic mode.

The chat mode usually refers to the one-to-one chat or group chat mode. The search mode is used to load specified messages and nearby messages, which is currently used to display search results. The topic (thread) mode is used to display and manage topics. They are distinguished by the `type` property. See the `ConversationDetailModelType` introduction for details. An example is as follows:

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatMessageChatType,
  ChatMessageType,
} from 'react-native-chat-sdk';
import {
  ConversationDetail,
  ConversationDetailModelType,
  ConversationDetailRef,
  gCustomMessageCardEventType,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
  useChatContext,
  useColors,
  usePaletteContext,
  uuid,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

// export function MyMessageContent(props: MessageContentProps) {
//   const { msg } = props;
//   if (msg.body.type === ChatMessageType.CUSTOM) {
//     return (
//       <View>
//         <Text>{(msg.body as ChatCustomMessageBody).params?.test}</Text>
//       </View>
//     );
//   }
//   return <MessageContent {...props} />;
// }

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { navigation, route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const selectType = ((route.params as any)?.params as any)?.selectType;
  const from = ((route.params as any)?.params as any)?.from;
  const hash = ((route.params as any)?.params as any)?.hash;
  const listRef = React.useRef<MessageListRef>({} as any);
  const inputRef = React.useRef<MessageInputRef>({} as any);
  const { top, bottom } = useSafeAreaInsets();
  const im = useChatContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convRef = React.useRef<ConversationDetailRef>({} as any);
  const comType = React.useRef<ConversationDetailModelType>('chat').current;

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ConversationDetail
        propsRef={convRef}
        type={comType}
        convId={convId}
        convType={convType}
        selectType={selectType}
      />
    </SafeAreaView>
  );
}
```

For specific usage, please refer to `example/src/demo/screens/ConversationDetailScreen.tsx` [source code](../../../example/src/demo/screens/ConversationDetailScreen.tsx).

## Data Management

`UIKit` provides registration interfaces for users to customize contact avatars and nicknames, and group avatars.

An example is as follows:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { GlobalContainer as CallKitContainer } from 'react-native-chat-callkit';
import { Container as UIKitContainer } from 'react-native-chat-uikit';
export function App() {
  const onUsersHandler = React.useCallback(
    async (data: Map<string, DataModel>) => {
      if (data.size === 0) return data;
      const userIds = Array.from(data.keys());
      const ret = new Promise<Map<string, DataModel>>((resolve, reject) => {
        im.getUsersInfo({
          userIds: userIds,
          onResult: (res) => {
            if (res.isOk && res.value) {
              const finalUsers = [] as DataModel[];
              for (const user of res.value) {
                finalUsers.push({
                  id: user.userId,
                  type: 'user',
                  name: user.userName,
                  avatar: user.avatarURL,
                  remark: user.remark,
                } as DataModel);
              }
              resolve(DataProfileProvider.toMap(finalUsers));
            } else {
              reject(data);
            }
          },
        });
      });
      return ret;
    },
    [im]
  );
  const onGroupsHandler = React.useCallback(
    async (data: Map<string, DataModel>) => {
      if (data.size === 0) return data;
      const ret = new Promise<Map<string, DataModel>>((resolve, reject) => {
        im.getJoinedGroups({
          onResult: (res) => {
            if (res.isOk && res.value) {
              const finalGroups = res.value.map<DataModel>((v) => {
                // !!! Not recommended: only for demo
                const g = v as ChatGroup;
                const avatar = g.options?.ext?.includes('http')
                  ? g.options.ext
                  : undefined;
                return {
                  id: v.groupId,
                  name: v.groupName,
                  avatar: v.groupAvatar ?? avatar,
                  type: 'group',
                } as DataModel;
              });
              resolve(DataProfileProvider.toMap(finalGroups));
            } else {
              reject(data);
            }
          },
        });
      });
      return ret;
    },
    [im]
  );

  return (
    <UIKitContainer
      options={{
        appKey: gAppKey,
      }}
      onGroupsHandler={onGroupsHandler}
      onUsersHandler={onUsersHandler}
    >
      {/* other settings */}
    </UIKitContainer>
  );
}
```

Also, the user can use the `updateDataList` method to update the avatar and nickname proactively.

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { GlobalContainer as CallKitContainer } from 'react-native-chat-callkit';
import { Container as UIKitContainer } from 'react-native-chat-uikit';
export function App() {
  const im = useChatContext();
  const updatedRef = React.useRef<boolean>(false);
  const updateData = React.useCallback(() => {
    if (updatedRef.current) {
      return;
    }
    updatedRef.current = true;
    im.getJoinedGroups({
      onResult: (r) => {
        if (r.value) {
          const groups: DataModel[] = [];
          r.value.forEach((conv) => {
            const avatar =
              conv.options?.ext && conv.options?.ext.includes('http')
                ? conv.options.ext
                : undefined;
            groups.push({
              id: conv.groupId,
              type: 'group',
              name: conv.groupName,
              avatar: avatar,
            });
          });
          im.updateDataList({
            dataList: DataProfileProvider.toMap(groups),
            isUpdateNotExisted: true,
            dispatchHandler: (data) => {
              const items = [];
              for (const d of data) {
                const item = {
                  groupId: d[0],
                  groupName: d[1].name,
                  groupAvatar: d[1].avatar,
                } as GroupModel;
                items.push(item);
              }
              im.sendUIEvent(UIListenerType.Group, 'onUpdatedListEvent', items);
              return false;
            },
          });
        }
      },
    });
  }, [im]);

  React.useEffect(() => {
    const listener: EventServiceListener = {
      onFinished: (params) => {
        if (params.event === 'getAllConversations') {
          timeoutTask(500, updateData);
        }
      },
    };
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im, updateData]);

  return (
    <UIKitContainer
      options={{
        appKey: gAppKey,
      }}
    >
      {/* Other settings */}
    </UIKitContainer>
  );
}
```

## FAQ

1. Q: Why do errors occurring during compilation fail to be output in the Console?

A: You need to compile with Xcode to discover more error for troubleshooting. Compared with `xcode` or `android studio`, less information is output in the terminal console.
