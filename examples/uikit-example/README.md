_English | [中文](./README.zh.md)_

---

# Quick-Start

This project demonstrates how to use Agora Chat UIKit.

**See the [parent document](./../../README.md) for details on the project development environment, repository download address, configuration information and configuration files.**

## Compile and run

After the repository initialization is complete, compile and run the sample project.

```sh
cd example && yarn run gen-env
```

If it is `iOS` platform, `pod install` is required.

```sh
cd example/ios && pod install
```

If it is `Android` platform, `gradle sync project` is required.

Run the debug service.

```sh
cd example && yarn run start
```

Run ios or Android

```sh
cd example && yarn run ios
# or
cd example && yarn run android
```

## Parameter Settings

After project initialization, a local configuration file of `env.ts` will be generated in the `example` project.

```typescript
export const test = false; // test mode or no
export const appKey = ''; // from register console
export const id = ''; // default user id
export const ps = ''; // default password or token
export const accountType = 'agora'; // 'easemob' or 'agora'
```

- `test`: When it is `true`, the page will switch to the simple component test mode, and the demonstration of the local component can be completed without performing remote operations such as login and logout. Defaults to `false`
- `appKey`: The unique identifier of the application, usually obtained through the background of the website
- `id`: The id of the logged-in user, usually obtained through registration or the background of the website
- `ps`: The secret key of the logged-in user, usually obtained through registration or the background of the website
- `accountType`: You can switch between domestic and foreign logins, the default is `agora`

---

# Integrate UIKIT In Existing Projects

There are several ways to use `uikit`:

1. Create a new project and integrate `uikit`. In this case, you need to pay attention to the development environment. Errors may be reported when compiling and running due to cross-version.
1. In the existing project, integrate `uikit`. In this case, you need to pay attention to the compatibility between the existing project version and the `uikit` project version, as well as the dependent version.
1. Modify the `example` project to complete product development. In this case, there are almost no development environment problems, but it is necessary to learn and understand the architectural thinking of `example` in order to better complete application development.

The following is the most common way, the introduction of integrating `uikit` in existing projects.

## Install `uikit` into an existing project

```sh
cd your_project_root
yarn add react-native-chat-uikit
```

For development, compilation, and operation, please refer to relevant chapters. The following uses the integrated chat page as an example to illustrate.

## Initialize settings

Before you are ready to use uikit, you need to initialize it. The modal component is used to receive events and display the modal window. Use default if default.

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

**Description** The modal window management component needs to be set up during initialization. If this parameter is defaulted, the corresponding event notification may not be received.
**Description** Please refer to [Reference](./example/src/App.tsx) for actual use

## Quick Integration Chat Page

The chat page consists of several components. It mainly includes: message bubble list component and input component. The input component is composed of emoji component, voice component and extension component.

<img src=https://github.com/AgoraIO-Usecase/AgoraChat-rntree/dev/docs/typical/ui_chat_struct_1.jpg width="50%">

<!-- <img src=https://img-blog.csdnimg.cn/20200822014538211.png width=60% /> -->

![img](./docs/typical/ui_chat_struct_1.jpg){: width="100px" height="100px"}

## The Easiest Way To Integrate

1. In the entry method, complete the initialization of `uikit`
2. Use the `ChatFragment` component in the target page

Sample code:

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

## Set Up A Personalized Chat Component

The chat component has many parameters and configurations, which can be set according to the needs to achieve the desired effect. For more advanced customization, please refer to the source code implementation.

#### The interface provided by the chat component

The chat component `ChatFragment` provides methods for sending all messages except command messages, and sending messages will be loaded to the chat bubble list page by default. Also provides a method to load historical messages.
If you want to use these methods, you need to set the `propsRef` parameter in the chat properties.

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

#### The properties provided by the chat component

The chat component mainly provides common attributes. For example: set custom chat bubble list components, callbacks for various buttons or states.

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

#### The interface provided by the chat bubble list component

The chat bubble list component `MessageBubbleList` provides scrolling interface and loading message interface. Messages can be loaded directly by calling the `addMessage` method. Messages can also be added indirectly by manipulating the `ChatFragment` component.

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

#### The properties provided by the chat bubble list component

The chat bubble list component mainly displays messages. Currently, it provides a custom message bubble style, and a pull-down refresh request history message callback. Default style is used if not provided. Currently only text, image, and voice provide default styles.

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

#### Chat Properties: Controller

`propsRef` This property is mainly used to actively call related methods of `ChatFragment`.

**Knowledge points** For `React-Native` technical framework, UI components generally provide several ways to determine component behavior.

1. Use attributes to initialize or dynamically update component styles
2. Use attribute callbacks to notify upper-level users of status changes
3. Use controllers (ref) to control the active behavior of subcomponents

Example: After recording a voice, send a voice message

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

For example: After selecting a picture, send a picture message

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

#### Chat property: chat bubble list component

When the default chat bubble cannot meet the custom requirements, you can design the style of the chat bubble yourself.

Suppose `MessageBubbleList` is a custom chat bubble list component.

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

**Description** Since `MessageBubbleList` implements too many source codes, please refer to it if necessary [here](https://github.com/AgoraIO-Usecase/AgoraChat-rntree/dev/example/src/components/CustomMessageBubble.tsx)

#### Chat Properties: Unread Count Notifications

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

#### Chat properties: click on the chat bubble notification

Typical applications: playing voice messages, displaying picture previews.

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

#### Chat properties: Long press the message bubble notification

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

#### Chat Properties: Notify on click of extension button

Typical application: display message context menu, and perform operations such as message forwarding and message cancellation.

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

#### Chat Properties: Press the voice button notification

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

#### Chat properties: Raise the voice button notification

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

#### Chat property: send message notification

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

#### Chat property: send message completion notification

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

#### Chat property: voice recording end notification

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

#### Bubble property: custom background color

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

#### Bubble property: hide time label

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

#### Bubble property: custom text message style

For example: Modify text message background color, avatar, text bubble, message status, etc.

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

## Quick integration session list

The easiest way to integrate `ConversationListFragment`:

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

### The methods provided by the session list

The session component provides methods for creating, updating, reading, and extending attributes.

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

### Attributes provided by the session list

The session list provides attributes of click, long press, unread count, sorting strategy, and custom style.

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

#### Set up a personalized session list

#### Session list attribute: click callback

Click on the conversation list item, typical application: enter the chat page.

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

#### Session list attribute: long press callback

Long press the chat list item, typical application: display the context menu.

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

#### session list attribute: update unread count callback

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

#### Session list attribute: sorting strategy

The default sorting is to sort `convId`, you can set it yourself if you want. Typical application: session sticking to the top.

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

#### Session List Properties: Custom Styles

The display style of the session list items can be customized.
**Note** If you activate the side sliding function, you need to set the width of the side sliding component.

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

If you have more questions, please check here, and if you have more suggestions, please contribute here.

[skip to here](../QA.md)

---

# mind Mapping

The description of this dimension may increase your understanding of the project.

[skip to here](../swdt.md)
