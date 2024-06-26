[Return to Parent Document](./index.en.md)

- [Introduction to Examples](#introduction-to-examples)
  - [Project Configuration](#project-configuration)
  - [Project Compilation](#project-compilation)
  - [Rest service](#rest-service)
  - [Initialization](#initialization)
  - [Routing](#routing)
    - [How to Register Pages](#how-to-register-pages)
    - [How to Switch Pages](#how-to-switch-pages)
    - [How to return to a page](#how-to-return-to-a-page)
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

In addition, it is important to note that this project is a local dependency, so it will automatically use the locally provided npm package in the repository.

## Project Compilation

The project is a subdirectory of the repository. You need to initialize the repository before building the project.

```sh
# In the root directory.
yarn
# Initialize configurations and generate files like version.ts, env.ts, and config.local.ts, and fill in necessary parameters.
yarn yarn-prepack
# Switch to the subdirectory.
cd examples/uikit-example
# For an ios platform, run the following command.
cd ios && pod install
# For the android platform, run the sync of the android project.
```

You need to fill in necessary parameters, for example: `appKey`, in the generated file `env.ts`.

## Rest service

To run this sample project, you need to configure `AppServer`. Specifically, you need to deploy the `AppServer` service on the server side and implement the `RestApi` API on the client side (refer to `RestApi` for details).

Within this sample project, configure the server address with `RestApi.setServer` and provide APIs for getting mobile phone number verification codes, logging in with mobile phone numbers, uploading avatars, getting `rtcToken`, getting `rtcMap`, and getting the group owner's avatar.

For details, see `example/src/demo/common/rest.api.ts` [source code](../../../example/src/demo/common/rest.api.ts).

## Initialization

The project configuration is very important and is usually completed in the early phase of the program's runtime.

An example is shown below:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { GlobalContainer as CallKitContainer } from 'react-native-chat-callkit';
import { Container as UIKitContainer } from 'react-native-chat-uikit';
export function App() {
  // ...
  return (
    <UIKitContainer
      options={{
        appKey: gAppKey,
      }}
    >
      <CallKitContainer
        option={{
          appKey: gAppKey,
          agoraAppId: agoraAppId,
        }}
        type={accountType as any}
        requestRTCToken={requestRTCToken}
        requestUserMap={requestUserMap}
        requestCurrentUser={requestCurrentUser}
        requestUserInfo={requestUserInfo}
        requestInviteContent={requestInviteContent}
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
      </CallKitContainer>
    </UIKitContainer>
  );
}
```

For the detailed usage, please refer to `example/src/demo/App.tsx`.

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

The sample project is encapsulated for your convenience.

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationListScreen(props: Props) {
  const navi = useNativeStackRoute();
  return (
    <ConversationList
      onClickedNewGroup={() => {
        navi.push({ to: 'CreateGroup' });
      }}
      onClickedNewConversation={() => {
        navi.navigate({ to: 'NewConversation' });
      }}
    />
  );
}
```

### How to return to a page

Navigating from page A to page B and then returning from page B to page A can mark the completion of a navigation sequence, or may involve carrying data back. Therefore, the encapsulated tool is recommended for convenience.

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AVSelectGroupParticipantScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const groupId = ((route.params as any)?.params as any)?.groupId;

  return (
    <AVSelectGroupParticipant
      groupId={groupId}
      onBack={() => {
        // Return normally
        navi.goBack();
      }}
      onSelectResult={(data) => {
        // Return with parameters
        navi.goBack({
          props: {
            selectedMembers: data,
          },
        });
      }}
    />
  );
}
```

For details, see `example/src/demo/routes`.

## Pages

There are not many core page components, but they provide a variety of customization interfaces.

### Page Structure

In the core pages, the list components include the conversation list, contact list, group list, and group participant list. The detail components include contact detail and group detail.

### List Components

This type of component mainly consists of a navigation bar component, a search component, and a list component. The navigation bar can be displayed, hidden, or customized. The search component, upon a click, navigates to the search page of the component, allowing you to retrieve the current content of the page. The list component displays the current content.

List components:

- ConversationList: `packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.tsx` [Source Code](../../../packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.tsx)
- ContactList: `packages/react-native-chat-uikit/src/biz/ContactList/ContactList.tsx` [Source Code](../../../packages/react-native-chat-uikit/src/biz/ContactList/ContactList.tsx)
- GroupList: `packages/react-native-chat-uikit/src/biz/GroupList/GroupList.tsx` [Source Code](../../../packages/react-native-chat-uikit/src/biz/GroupList/GroupList.tsx)
- GroupParticipantList: `packages/react-native-chat-uikit/src/biz/GroupParticipantList/GroupParticipantList.tsx` [Source Code](../../../packages/react-native-chat-uikit/src/biz/GroupParticipantList/GroupParticipantList.tsx)

Among them, the contact list component is a reusable component that can be used as needed. For example: displaying the contact list, or using it on the user selection page during group creation. For example:

```tsx
// Contact list page
export type ContactListScreenProps = {};
function ContactListScreen(props: ContactListScreenProps) {
  const {} = props;
  const navi = useNativeStackRoute();

  return (
    <ContactList
      contactType={'contact-list'}
      onClickedSearch={() => {
        navi.navigate({
          to: 'SearchContact',
          props: {
            searchType: 'contact-list',
          },
        });
      }}
      onClickedItem={(data) => {
        if (data?.userId) {
          navi.navigate({
            to: 'ContactInfo',
            props: {
              userId: data.userId,
            },
          });
        }
      }}
      onClickedGroupList={() => {
        navi.navigate({ to: 'GroupList' });
      }}
      onClickedNewRequest={() => {
        navi.navigate({ to: 'NewRequests' });
      }}
    />
  );
}
```

```tsx
// New conversation page
export type NewConversationProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClickedItem' | 'onClickedSearch' | 'onBack'
>;
export function NewConversation(props: NewConversationProps) {
  return <ContactList contactType={'new-conversation'} {...props} />;
}
```

```tsx
// Namecard sharing page
export function ShareContact(props: ShareContactProps) {
  return <ContactList contactType={'share-contact'} {...props} />;
}
```

```tsx
// Group creation page
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateGroupScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const im = useChatContext();
  const data = ((route.params as any)?.params as any)?.data;
  return (
    <SafeAreaViewFragment>
      <CreateGroup
        onClickedSearch={() => {
          navi.navigate({
            to: 'SearchContact',
            props: {
              searchType: 'create-group',
            },
          });
        }}
        selectedData={data}
        onCreateGroupResult={(result) => {
          if (result.isOk === true && result.value) {
            navi.navigation.pop();
            navi.navigate({
              to: 'ConversationDetail',
              props: {
                convId: result.value?.groupId,
                convType: 1,
                convName: result.value?.groupName ?? result.value?.groupId,
              },
            });
          } else {
            navi.goBack();
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
```

### Detail Components

When a user avatar or group avatar is clicked, the detail component page can be opened.

Detail components include:

- ContactInfo: `packages/react-native-chat-uikit/src/biz/Info/ContactInfo.tsx` [Source Code](../../../packages/react-native-chat-uikit/src/biz/Info/ContactInfo.tsx)
- GroupInfo: `packages/react-native-chat-uikit/src/biz/Info/GroupInfo.tsx` [Source Code](../../../packages/react-native-chat-uikit/src/biz/Info/GroupInfo.tsx)

This type of component consists of a navigation bar component, an avatar component, and a single-item list component. The navigation bar can be displayed, hidden, or customized. Other parts can be modified and displayed.

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { start, stop } = useOnce();
  const { tr } = useI18nContext();
  const userId = ((route.params as any)?.params as any)?.userId;
  const editedData = ((route.params as any)?.params as any)?.editedData;
  const editType = ((route.params as any)?.params as any)?.editType;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const contactRef = React.useRef<any>({} as any);

  React.useEffect(() => {
    hash;
    if (from === 'EditInfo') {
      stop(() => {
        if (editType === 'contactRemark') {
          contactRef.current?.setContactRemark?.(userId, editedData);
        }
      });
    }
  }, [editType, editedData, stop, userId, hash, from]);

  return (
    <SafeAreaViewFragment>
      <ContactInfo
        ref={contactRef}
        userId={userId}
        onSendMessage={() => {
          navi.navigate({
            to: 'ConversationDetail',
            props: {
              convId: userId,
              convType: 0,
            },
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
        onClickedContactRemark={(_userId, remark) => {
          start(() => {
            navi.push({
              to: 'EditInfo',
              props: {
                backName: tr('_demo_edit_contact_remark'),
                saveName: tr('done'),
                initialData: remark,
                editType: 'contactRemark',
                maxLength: 128,
              },
            });
          });
        }}
      />
    </SafeAreaViewFragment>
  );
}
```

### Chat Component

The chat components mainly include chat mode, search mode, topic creation mode, and topic mode.

The chat mode usually refers to the one-to-one chat or group chat mode. The search mode is used to load specified messages and nearby messages, which is currently used to display search results. The topic (thread) mode is used to display and manage topics. They are distinguished by the `type` property. See the `ConversationDetailModelType` introduction for details. An example is as follows:

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const name = route.name as RootParamsName;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const selectType = ((route.params as any)?.params as any)?.selectType;
  const comType = React.useRef<ConversationDetailModelType>(
    name === 'ConversationDetail'
      ? 'chat'
      : name === 'MessageThreadDetail'
      ? 'thread'
      : name === 'MessageHistory'
      ? 'search'
      : 'create_thread'
  ).current;

  return (
    <SafeAreaViewFragment>
      <ConversationDetail
        propsRef={convRef}
        type={comType}
        convId={convId}
        convType={convType}
        selectType={selectType}
      />
    </SafeAreaViewFragment>
  );
}
```

For specific usage, please refer to `example/src/demo/screens/ConversationDetailScreen.tsx` [source code](../../../example/src/demo/screens/ConversationDetailScreen.tsx).

## Data Management

UIKit provides registration interfaces for users to customize contact avatars and nicknames, and group avatars.

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
      {/* Other settings */}
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
