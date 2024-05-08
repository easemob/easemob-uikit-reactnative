[返回父文档](./index.md)

- [示例介绍](#示例介绍)
  - [项目配置](#项目配置)
  - [项目编译](#项目编译)
  - [初始化介绍](#初始化介绍)
  - [路由介绍](#路由介绍)
    - [如何注册页面](#如何注册页面)
    - [如何切换页面](#如何切换页面)
  - [页面介绍](#页面介绍)
    - [页面结构](#页面结构)
    - [列表类组件](#列表类组件)
    - [详情类组件](#详情类组件)
    - [聊天类组件](#聊天类组件)
  - [数据管理](#数据管理)
  - [常见问题](#常见问题)

# 示例介绍

该示例项目演示了 `uikit` 的使用方式。项目的配置和编译、依赖可以参考 其它文档。这里主要介绍各个组件的具体使用。

由于 `uikit` 里面没有包括 路由功能，所以，这里也详细介绍 路由相关的使用。

`uikit` 核心部分主要是初始化的配置、会话列表页面、联系人列表页面、群组列表页面、群成员列表页面、聊天页面，联系人详情页面、群组详情页面，以及相关的组件。这些组件在该示例项目中都一一使用。还使用了主题、国际化等工具。还使用了音视频通话组件库。还是用了 `AppServer` 工具作为登录、获取信息的服务。除了直接使用的页面级组件之外，还提供了基础组件，可以方便搭建更为复杂的组件，方便业务开发。

## 项目配置

参考 `existed-app` 章节。
除此之外，需要注意，该项目为本地依赖，即它会自动使用仓库中提供的本地 npm 包。不需要显示指定。

## 项目编译

项目是仓库的子目录。需要先初始化仓库，再构建项目。

```sh
# 在根目录下
yarn
# 初始化配置 生成 version.ts, env.ts, config.local.ts等文件, 需要填写必要参数
yarn yarn-prepack
# 切换到子目录
cd examples/uikit-example
# 如果是ios平台 需要运行
cd ios && pod install
# 如果是android平台 需要运行 android项目的sync
```

生成文件 `env.ts` 需要填写必要参数。例如：`appKey`。

## 初始化介绍

项目的配置是非常重要的，通常在程序运行的前期就完成。

示例如下：

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
          {/* 更多页面 */}
        </Root.Navigator>
      </NavigationContainer>
    </UIKitContainer>
  );
}
```

具体用法详见 `examples/uikit-example/src/demo/App.tsx`

## 路由介绍

### 如何注册页面

该示例项目使用 `react-navigation` 三方库进行页面级路由管理。 `react-native` 没有内置路由功能。

注册页面示例如下：

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
        {/* 更多的页面注册 */}
      </Root.Navigator>
    </NavigationContainer>
  );
}
```

### 如何切换页面

常见的切换路由是，在页面 A 跳转到页面 B。例如：

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

## 页面介绍

核心页面组件并不多，但是提供了丰富的自定义接口。

### 页面结构

核心页面中，列表类组件包括会话列表、联系人列表、群组列表、群成员列表。详情类包括联系人详情、群组详情。

### 列表类组件

此类组件主要由导航栏组件、搜索组件、列表组件组成。 导航栏可以显示、隐藏或者自定义。搜索组件点击跳转到该组件的搜索页面，可以搜索当前页面的内容，列表组件显示当前的内容。

列表类组件:

- ConversationList: `packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.tsx` [源码](../../../packages/react-native-chat-uikit/src/biz/ConversationList/ConversationList.tsx)
- ContactList: `packages/react-native-chat-uikit/src/biz/ContactList/ContactList.tsx` [源码](../../../packages/react-native-chat-uikit/src/biz/ContactList/ContactList.tsx)
- GroupList: `packages/react-native-chat-uikit/src/biz/GroupList/GroupList.tsx` [源码](../../../packages/react-native-chat-uikit/src/biz/GroupList/GroupList.tsx)
- GroupParticipantList: `packages/react-native-chat-uikit/src/biz/GroupParticipantList/GroupParticipantList.tsx` [源码](../../../packages/react-native-chat-uikit/src/biz/GroupParticipantList/GroupParticipantList.tsx)

其中，联系人列表组件是复用组件，可以根据需要进行使用。例如：正常显示联系人列表、也可以用在创建群组的选人页面。 例如：

```tsx
// 联系人列表页面
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
// 共享名片页面
export function ShareContact(props: ShareContactProps) {
  return <ContactList contactType={'share-contact'} {...props} />;
}
```

### 详情类组件

当点击用户头像或者群组头像时，可以打开详情类组件页面。

详情类组件包括:

- ContactInfo: `packages/react-native-chat-uikit/src/biz/Info/ContactInfo.tsx` [源码](../../../packages/react-native-chat-uikit/src/biz/Info/ContactInfo.tsx)
- GroupInfo: `packages/react-native-chat-uikit/src/biz/Info/GroupInfo.tsx` [源码](../../../packages/react-native-chat-uikit/src/biz/Info/GroupInfo.tsx)

该类组件由导航栏组件、头像组件、单项列表组件组成。 导航来可以显示、隐藏和自定义。 其它部分可以使用修改和显示。

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

### 聊天类组件

聊天组件主要包括聊天模式、搜索模式、创建话题模式、话题模式。

聊天模式下，就是通常的单群聊模式。搜索模式是加载指定消息和附近消息，目前用在搜索结果显示，话题（thread）模式用来显示和管理话题。他们都通过 `type` 属性来区别。 详见 `ConversationDetailModelType` 介绍。 示例如下：

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

具体用法详见 `example/src/demo/screens/ConversationDetailScreen.tsx` [源码](../../../example/src/demo/screens/ConversationDetailScreen.tsx)。

## 数据管理

`uikit` 提供了注册接口，可以让用户自定义联系人的头像和昵称，群组的头像。

示例如下：

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
      {/* 其它设置 */}
    </UIKitContainer>
  );
}
```

如果用户希望主动更新头像和昵称。可以使用 `updateDataList` 方法。

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
      {/* 其它设置 */}
    </UIKitContainer>
  );
}
```

## 常见问题

1. 编译遇到问题，但是控制台没有输出
   参考描述: 需要使用 xcode 进行编译，发现更多的错误提示，根据提示做处理。终端控制台输出的信息没有`xcode`或者`android studio`的多。
