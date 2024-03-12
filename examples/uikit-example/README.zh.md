_中文 | [English](./README.md)_

---

# 快速开始

带你快速的完成项目的编译和运行。

## 环境准备

- 操作系统：
  - MacOS 10.15.7 或以上版本
- 工具集合：
  - Xcode 13.4 或以上版本 （如果开发 iOS 平台引用）
  - Android studio 2021.3.1 或以上版本 （如果开发 Android 平台应用）（简称 as）
  - Visual Studio Code latest （简称 vscode）
- 编译运行环境：
  - Java JDK 1.8.0 或以上版本 （推荐使用 Android studio 自带）
  - Objective-C 2.0 或以上版本 （推荐使用 Xcode 自带）
  - Typescript 4.0 或以上版本
  - Nodejs 16.18.0 或以上版本 （推荐使用 brew 安装）
  - yarn 1.22.19 或以上版本 （推荐使用 brew 安装）
  - React-Native 0.63.5 以上
  - npm 以及相关工具 （**不推荐**，相关问题请自行解决）
  - expo 6.0.0 或以上版本

## 源码下载

[下载地址](https://github.com/AgoraIO-Usecase/AgoraChat-rn)

```sh
git clone git@github.com:AgoraIO-Usecase/AgoraChat-rn.git
```

## 编译运行

1. 在 `repo` 根目录 初始化 所有项目

```sh
yarn
```

2. 执行 `example` 项目初始化

```sh
cd example && yarn run gse
```

3. 如果是 `iOS` 平台，需要 `pod install`

```sh
cd example/ios && pod install
```

4. 如果是 `Android` 平台，需要 `gradle sync project`

5. 运行调试服务

```sh
cd example && yarn run start
```

## 参数设置

在项目初始化之后，会在 `example` 项目中生成 `env.ts` 的本地配置文件。

```typescript
export const test = false; // test mode or no
export const appKey = ''; // from register console
export const id = ''; // default user id
export const ps = ''; // default password or token
export const accountType = 'agora'; // 'easemob' or 'agora'
```

- `test`: 当为`true`的时候，页面会切换到单纯的组件测试模式，可以不用执行登录、退出等远程操作,就可以完成本地组件的演示。默认为 `false`
- `appKey`: 应用的唯一标识，一般通过网站后台获取
- `id`: 登录用户的 id，一般通过注册或者网站后台获取
- `ps`: 登录用户的 秘钥，一般通过注册或者网站后台获取
- `accountType`: 可以切换国内外登录, 默认为 `agora`

---

# 在已有项目中集成 UIKIT

使用 `uikit` 的方式主要有这几种：

1. 创建全新项目，集成 `uikit`。 这种情况，需要注意开发环境的问题。可能由于跨大版本导致编译和运行报错。
2. 在现有项目中，集成 `uikit`。 这种情况，需要注意现有项目版本 和 `uikit` 项目的版本，以及依赖版本的兼容性。
3. 修改 `example` 项目，完成产品开发。这种情况，几乎没有开发环境问题，但是需要学习和了解 `example` 的架构思维，才能更好的完成应用开发。

下面进行最常见的方式，已有项目中集成 `uikit` 的介绍。

## 安装 `uikit` 到现有项目中

```sh
cd your_project_root
yarn add react-native-chat-uikit
```

## 初始化设置

在准备使用 uikit 之前，需要进行初始化操作。其中模态组件是用来接收事件并显示模态窗口的。如果缺省则使用默认的。

```typescript
import { GlobalContainer as UikitContainer } from 'react-native-chat-uikit';
import { ModalPlaceholder } from './events';
export default function App() {
  return (
    <React.StrictMode>
      <UikitContainer
        option={{
          appKey: appKey,
          autoLogin: autoLogin.current,
          debugModel: true,
        }}
        ModalComponent={() => <ModalPlaceholder />}
      />
    </React.StrictMode>
  );
}
```

**说明** 需要在初始化的时候设置好模态窗口管理组件。如果缺省该参数，可能无法收到相应的事件通知。
**说明** 实际使用请[参考](./example/src/App.tsx)

开发、编译和运行等请参考相关章节，下面以集成聊天页面为例进行说明。

## 快速集成聊天页面

聊天页面由多个组件组成。主要包括：消息气泡列表组件、输入组件。 输入组件由表情组件、语音组件、扩展组件组成。

<img src=https://github.com/AgoraIO-Usecase/AgoraChat-rntree/dev/docs/typical/ui_chat_struct_1.jpg width="50%">

<!-- <img src=https://img-blog.csdnimg.cn/20200822014538211.png width=60% /> -->

![img](./docs/typical/ui_chat_struct_1.jpg){: width="100px" height="100px"}

## 最简单的集成方式

1. 在入口方法中，完成 `uikit` 的初始化
2. 在目标页面中使用 `ChatFragment` 组件

示例代码：

```typescript
import * as React from 'react';
import { ChatFragment, ScreenContainer } from 'react-native-chat-uikit';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment screenParams={{ chatId, chatType }} />
    </ScreenContainer>
  );
}
```

## 设置个性化的聊天组件

聊天组件带有很多参数和配置，可以更具需要进行设置，达到需要的效果。 对于更多更高的自定义可以参考源码实现。

#### 聊天组件提供的接口

聊天组件 `ChatFragment` 提供了除去命令消息之外的所有消息的发送方法，发送消息会默认加载到聊天气泡列表页面。也提供加载历史消息的方法。
如果想要使用这些方法，需要在聊天属性里面设置 `propsRef` 参数。

```typescript
export type ChatFragmentRef = {
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: string;
      imageType: string;
      width: number;
      height: number;
    }[]
  ) => void;
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
  }) => void;
  sendTextMessage: (params: { content: string }) => void;
  sendCustomMessage: (params: { data: CustomMessageItemType }) => void;
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
  }) => void;
  sendVideoMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    duration: number;
    thumbnailLocalPath?: string;
    width?: number;
    height?: number;
  }) => void;
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
  }) => void;
  loadHistoryMessage: (msgs: ChatMessage[]) => void;
};
```

#### 聊天组件提供的属性

聊天组件主要提供了常用的属性。例如：设置自定义聊天气泡列表组件，各种按钮或者状态的回调。

```typescript
type ChatFragmentProps = {
  propsRef?: React.RefObject<ChatFragmentRef>;
  screenParams: {
    params: {
      chatId: string;
      chatType: number;
    };
  };
  messageBubbleList?: {
    bubbleList: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    bubbleListProps: MessageBubbleListProps;
    bubbleListRef: React.RefObject<MessageBubbleListRef>;
  };
  customMessageBubble?: {
    messageRenderItem: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  onUpdateReadCount?: (unreadCount: number) => void;
  onClickMessageBubble?: (data: MessageItemType) => void;
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  onClickInputMoreButton?: () => void;
  onPressInInputVoiceButton?: () => void;
  onPressOutInputVoiceButton?: () => void;
  onSendMessage?: (message: ChatMessage) => void;
  onSendMessageEnd?: (message: ChatMessage) => void;
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
};
```

#### 聊天气泡列表组件提供的接口

聊天气泡列表组件 `MessageBubbleList` 提供了滚动接口以及加载消息接口。可以直接调用 `addMessage` 方法加载消息。也可以通过操控 `ChatFragment` 组件间接添加消息。

```typescript
export type MessageBubbleListRef = {
  scrollToEnd: () => void;
  scrollToTop: () => void;
  addMessage: (params: {
    msgs: MessageItemType[];
    direction: InsertDirectionType;
  }) => void;
  updateMessageState: (params: {
    localMsgId: string;
    result: boolean;
    reason?: any;
    item?: MessageItemType;
  }) => void;
  delMessage: (params: { localMsgId?: string; msgId?: string }) => void;
  resendMessage: (localMsgId: string) => void;
  recallMessage: (msg: ChatMessage) => void;
};
```

#### 聊天气泡列表组件提供的属性

聊天气泡列表组件主要进行消息展示，目前提供自定义消息气泡的样式，以及下拉刷新请求历史消息的回调。如果没有提供则使用默认样式。目前只有 文本、图片、语音提供了默认样式。

```typescript
export type MessageBubbleListProps = {
  onRequestHistoryMessage?: (params: { earliestId: string }) => void;
  TextMessageItem?: ListRenderItem<TextMessageItemType>;
  ImageMessageItem?: ListRenderItem<ImageMessageItemType>;
  VoiceMessageItem?: ListRenderItem<VoiceMessageItemType>;
  FileMessageItem?: ListRenderItem<FileMessageItemType>;
  LocationMessageItem?: ListRenderItem<LocationMessageItemType>;
  VideoMessageItem?: ListRenderItem<VideoMessageItemType>;
  CustomMessageItem?: ListRenderItem<CustomMessageItemType>;
  showTimeLabel?: boolean;
  style?: StyleProp<ViewStyle>;
};
```

#### 聊天属性：控制器

`propsRef` 该属性主要可以主动调用 `ChatFragment` 的相关方法。

**知识点** 对于 `React-Native` 技术框架，UI 组件一般提供几种方式决定组件行为。

1. 使用属性来初始化或者动态更新组件样式
2. 使用属性回调通知上层使用者状态的变化
3. 使用控制器（ref）控制子组件的主动行为

例如：在录制语音之后，发送语音消息

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onVoiceRecordEnd={(params) => {
          chatRef.current.sendVoiceMessage(params);
        }}
      />
    </ScreenContainer>
  );
}
```

例如：在选择好图片之后，发送图片消息

```typescript
import type { BizEventType, DataActionEventType } from '../events';
import { DataEventType } from 'react-native-chat-uikit';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { action } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp?: number;
        };
        switch (action) {
          case 'chat_open_media_library':
            Services.ms
              .openMediaLibrary({ selectionLimit: 1 })
              .then((result) => {
                chatRef.current?.sendImageMessage(result as any);
              })
              .catch((error) => {
                console.warn('error:', error);
              });
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [addListeners]);
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment screenParams={{ chatId, chatType }} />
    </ScreenContainer>
  );
}
```

#### 聊天属性：聊天气泡列表组件

当默认聊天气泡不能满足自定义需求的时候，可以自行设计聊天气泡样式。

假设 `MessageBubbleList` 是自定义的聊天气泡列表组件。

```typescript
import type { MessageBubbleListProps } from '../fragments/MessageBubbleList';
import MessageBubbleList from '../fragments/MessageBubbleList';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        messageBubbleList={{
          bubbleList: MessageBubbleListFragment,
          bubbleListProps: {
            TextMessageItem: MyTextMessageBubble,
            VideoMessageItem: MyVideoMessageBubble,
            FileMessageItem: MyFileMessageBubble,
          } as MessageBubbleListProps,
          bubbleListRef: messageBubbleListRefP as any,
        }}
      />
    </ScreenContainer>
  );
}
```

**说明** 由于 `MessageBubbleList` 实现源码太多，如有需要请参考 [here](https://github.com/AgoraIO-Usecase/AgoraChat-rntree/dev/example/src/components/CustomMessageBubble.tsx)

#### 聊天属性：未读数通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onUpdateReadCount={(unreadCount: number) => {
          // TODO: Broadcast no reading notification.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：点击聊天气泡通知

典型应用：播放语音消息，显示图片预览。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onClickMessageBubble={(data: MessageItemType) => {
          // TODO: If it is a voice message, it plays it, if it is a picture message, it previews it.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：长按消息气泡通知

典型应用：显示消息上下文菜单，进行消息转发、消息撤销等操作。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onLongPressMessageBubble={() => {
          // TODO: Displays the context menu. For example, message forwarding, message deletion, message resending, etc.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：点击扩展按钮通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onClickInputMoreButton={() => {
          // TODO: Open drawer menu, pop up list, for example: open media library, open document library, etc.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：按下语音按钮通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onPressInInputVoiceButton={() => {
          // TODO: The voice recording starts.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：抬起语音按钮通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onPressOutInputVoiceButton={() => {
          // TODO: The voice recording stops.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：发送消息通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onSendMessage={(message: ChatMessage) => {
          // TODO: Update the message.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：发送消息完成通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onSendMessageEnd={(message: ChatMessage) => {
          // TODO: Update message status, success or failure.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：语音录制结束通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onVoiceRecordEnd={(params: any) => {
          // TODO: Voice files are processed and voice messages are sent.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 气泡属性：自定义背景色

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        messageBubbleList={{
          bubbleList: MessageBubbleListFragment,
          bubbleListProps: {
            style: { backgroundColor: 'yellow' },
          } as MessageBubbleListProps,
          bubbleListRef: messageBubbleListRefP as any,
        }}
      />
    </ScreenContainer>
  );
}
```

#### 气泡属性：隐藏时间标签

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        messageBubbleList={{
          bubbleList: MessageBubbleListFragment,
          bubbleListProps: {
            showTimeLabel: false,
          } as MessageBubbleListProps,
          bubbleListRef: messageBubbleListRefP as any,
        }}
      />
    </ScreenContainer>
  );
}
```

#### 气泡属性：自定义文本消息样式

例如：修改文本消息背景色、头像、文本气泡，消息状态等。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        messageBubbleList={{
          bubbleList: MessageBubbleListFragment,
          bubbleListProps: {
            TextMessageItem: (info: ListRenderItemInfo<MessageItemType>) => {
              return <Text>{info.item.sender}</Text>;
            },
          } as MessageBubbleListProps,
          bubbleListRef: messageBubbleListRefP as any,
        }}
      />
    </ScreenContainer>
  );
}
```


https://github.com/AgoraIO-Usecase/AgoraChat-rnassets/11733363/e5fed2c3-ede4-47f4-86c3-c185800158f0




---

## 快速集成会话列表

`ConversationListFragment` 最简单的集成方式:

```typescript
import * as React from 'react';
import {
  ConversationListFragment,
  ScreenContainer,
} from 'react-native-chat-uikit';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ConversationListFragment />
    </ScreenContainer>
  );
}
```

### 会话列表提供的方法

会话组件提供了创建、更新、已读、扩展属性的方法。

```typescript
export type ConversationListFragmentRef = {
  update: (message: ChatMessage) => void;
  create: (params: { convId: string; convType: ChatConversationType }) => void;
  remove: (params: { convId: string; convType: ChatConversationType }) => void;
  updateRead: (params: {
    convId: string;
    convType: ChatConversationType;
  }) => void;
  updateExtension: (params: {
    convId: string;
    convType: ChatConversationType;
    ext?: any; // json object.
  }) => void;
};
```

### 会话列表提供的属性

会话列表提供了点击、长按、未读数、排序策略、自定义样式的属性。

```typescript
export type ConversationListFragmentProps = {
  propsRef?: React.RefObject<ConversationListFragmentRef>;
  onLongPress?: (data?: ItemDataType) => void;
  onPress?: (data?: ItemDataType) => void;
  onData?: (data: ItemDataType[]) => void;
  onUpdateReadCount?: (unreadCount: number) => void;
  sortPolicy?: (a: ItemDataType, b: ItemDataType) => number;
  RenderItem?: ItemComponent;
  /**
   * If `RenderItem` is a custom component and uses side-slip mode, you need to inform the width of the side-slide component.
   */
  RenderItemExtraWidth?: number;
};
```

#### 设置个性化的会话列表

#### 会话列表属性：点击回调

点击会话列表项，典型应用：进入聊天页面。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ConversationListFragment
        onPress={(data?: ItemDataType) => {
          // todo: enter to chat detail screen.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 会话列表属性：长按回调

长按聊天列表项，典型应用：显示上下文菜单。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ConversationListFragment
        onLongPress={(data?: ItemDataType) => {
          // todo: show context menu.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 会话列表属性：更新未读数回调

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ConversationListFragment
        onUpdateReadCount={(unreadCount: number) => {
          // todo: show unread message count.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 会话列表属性：排序策略

默认排序是对 `convId` 进行排序，如果需要可以自行设置。典型应用：会话置顶。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ConversationListFragment
        sortPolicy={(a: ItemDataType, b: ItemDataType) => {
          if (a.key > b.key) {
            return 1;
          } else if (a.key < b.key) {
            return -1;
          } else {
            return 0;
          }
        }}
      />
    </ScreenContainer>
  );
}
```

#### 会话列表属性：自定义样式

可以自定义会话列表项的显示样式。
**注意** 如果激活侧滑功能，需要设置侧滑组件的宽度。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ConversationListFragment
        RenderItem={(props) => {
          return <View />;
        }}
      />
    </ScreenContainer>
  );
}
```

https://github.com/AgoraIO-Usecase/AgoraChat-rnassets/11733363/0a3ac24c-9fae-4961-8395-89a3c2e6ef5e

---

# Q & A

如果你有更多疑问请查看这里，如果你有更多建议，也请贡献到这里。

[skip to here](../QA.md)

---

# 思维导图

这个维度的说明可能增加你对该项目的了解。

[skip to here](../swdt.md)
