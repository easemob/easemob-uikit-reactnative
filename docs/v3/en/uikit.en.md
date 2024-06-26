[Return to Parent Document](./index.en.md)

- [UIKit Introduction](#uikit-introduction)
  - [Initialization](#initialization)
  - [Themes](#themes)
  - [Internationalization](#internationalization)
  - [Business Components](#business-components)
    - [Conversation List](#conversation-list)
      - [Customize Navigation Bar](#customize-navigation-bar)
      - [Customize List Item](#customize-list-item)
    - [Message List (Conversation Details)](#message-list-conversation-details)
      - [Customize Navigation Bar](#customize-navigation-bar-1)
      - [Customize Message List](#customize-message-list)
    - [Contact List](#contact-list)
      - [Customize Navigation Bar](#customize-navigation-bar-2)
      - [Customize Contact List Items](#customize-contact-list-items)
    - [Contact Information/Group Information](#contact-informationgroup-information)
      - [Customize Navigation Bar](#customize-navigation-bar-3)
      - [Customize List Items](#customize-list-items)
      - [Customize Buttons](#customize-buttons)
    - [Group Participant List](#group-participant-list)
      - [Customize Navigation Bar](#customize-navigation-bar-4)
      - [Customize List Items](#customize-list-items-1)
    - [Functions on Chat/Conversation/New Conversation Page](#functions-on-chatconversationnew-conversation-page)
      - [Copy Text Message Content](#copy-text-message-content)
      - [Reply to Message](#reply-to-message)
      - [Forward Message](#forward-message)
      - [Select Multiple Messages](#select-multiple-messages)
      - [Edit Text Message](#edit-text-message)
      - [Translate Text Message](#translate-text-message)
      - [Report Message](#report-message)
      - [Delete Message](#delete-message)
      - [Recall Message](#recall-message)
      - [Create Topic](#create-topic)
      - [Customize Context Menu](#customize-context-menu)
  - [Basic Components](#basic-components)
  - [Event Dispatch](#event-dispatch)
  - [Customize Avatar and Nickname](#customize-avatar-and-nickname)
    - [Passive Registration](#passive-registration)
    - [Active Invocation](#active-invocation)

# UIKit Introduction

This is an introduction to version 2.1 of the UIKit component library. The component library includes themes, internationalization, core business UI components, basic UI components, chat service components, and transaction dispatch service components.

Make sure you initialize the UIKit component library before using it. This section introduces the key points, while other details can be found in the definitions and type declarations.

## Initialization

There are many parameters to be set during initialization. You must pass in `appKey` and determine whether to log in automatically. Other parameters are optional. See the `ContainerProps` type for details [here](../../../packages/react-native-chat-uikit/src/container/types.tsx).

```tsx
export function App() {
  const {
    initialRouteName,
    paletteRef,
    dark, // dark theme
    light, // light theme
    isLightRef,
    languageRef, // i18n
    translateLanguageRef,
    releaseAreaRef,
    getOptions,
    onInitLanguageSet,
    onGroupsHandler,
    onUsersHandler,
  } = useApp();

  return (
    <UIKitContainer
      options={getOptions()}
      palette={paletteRef.current}
      theme={isLightRef.current ? light : dark}
      language={languageRef.current}
      translateLanguage={translateLanguageRef.current}
      releaseArea={releaseAreaRef.current}
      fontFamily={fontFamily}
      headerFontFamily={boloo_da_ttf_name}
      onInitialized={onContainerInitialized}
      onInitLanguageSet={onInitLanguageSet}
      onGroupsHandler={onGroupsHandler}
      onUsersHandler={onUsersHandler}
    >
      {/* sub component */}
    </UIKitContainer>
  );
}
```

For sample code, see [example/src/demo/App.tsx](../../../example/src/demo/App.tsx).

## Themes

Themes mainly provide two parts: palette and theme. The palette is mainly responsible for basic styles, colors, layouts, etc. Combining advanced configuration options of the palette, the theme can be a light or dark one.

See the example source code for [example/src/demo/App.tsx](../../../example/src/demo/App.tsx).

## Internationalization

Internationalization currently provides content in Chinese and English by default. It allows you to customize other language packs and extend the existing language content.

See the example source code for [example/src/demo/App.tsx](../../../example/src/demo/App.tsx).

## Business Components

Business components are composed of basic components and mainly include conversation list components, contact list components, group list components, group participant list components, group participant list components, friend request notification list components, chat page components, group detail components, and contact detail components, etc.
The contact list component is a reusable component that supports operations such as creating groups, creating new conversations, and inviting multiple users to audio and video calls. The chat page component is also a reusable component that supports normal chat mode, topic mode, and search mode.

See the example source code for [example/src/demo/screens/ConversationDetailScreen.tsx](../../../example/src/demo/screens/ConversationDetailScreen.tsx).

The core component introductions are as follows:

| Component Set Name | Description                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container          | Entry component, used at the entrance of the application, supports global configurations and UI component library initialization.                                       |
| Theme              | Theme component consisting of `Palette` and `Theme` allows you to configure the color and style of UI components.                                                       |
| i18n               | Internationalization component. It provides default contents for Chinese and English UI components and allows you to change content and customize the target languages. |
| biz                | Page-level business component set, including `ConversationList`, `ContactList`, `GroupList`, `GroupParticipantList`, and `ConversationDetail`.                          |
| chat               | Message service component. It completes all non-page message processing.                                                                                                |
| config             | Configuration service component. It involves all global configurations.                                                                                                 |
| dispatch           | Event dispatch component. It implements inter-component communications.                                                                                                 |
| error              | Error object. All error objects in `uikit` are defined here.                                                                                                            |
| hook               | Custom hook component. It serves other components.                                                                                                                      |

| Page-level Component Name | Description                                                                                                                                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ConversationList          | Conversation list component that displays and manages the conversation lists.                                                                                                                                                             |
| ContactList               | Contact list component that displays and manages the contact list. This component is reused in pages for contact list, creating a conversation, creating a group, adding a group member, sharing a business card, and message forwarding. |
| ConversationDetail        | Message page component that allows sending and receiving messages and loading historic messages in one-to-one and group chats. This component is reused in pages for chat, search, topic, and creating a topic.                           |
| GroupList                 | Group list component that provides display and management of group lists.                                                                                                                                                                 |
| GroupParticipantList      | Group participant list component that displays and manages the group participant list. This component is reused in pages for adding or removing a group member, changing the group owner, and multi-person audio and video pages.         |
| NewRequests               | New notification list component that receives and handles friend request.                                                                                                                                                                 |
| CreateGroup               | Component for creating a group.                                                                                                                                                                                                           |
| ContactInfo               | Contact detail component.                                                                                                                                                                                                                 |
| GroupInfo                 | Group detail component.                                                                                                                                                                                                                   |

### Conversation List

#### Customize Navigation Bar

![导航栏截图-布局]()

The navigation bar component is a universal component with a layout that contains the left, right, and centered parts. This component supports custom left, centered, and right components, which allow you to modify styles, layouts, and behaviors. Examples are as follows:

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);
  const { tr } = useI18nContext();

  return (
    <ConversationList
      propsRef={convRef}
      customNavigationBar={
        <TopNavigationBar
          Left={
            <StatusAvatar
              url={
                'https://cdn3.iconfinder.com/data/icons/vol-2/128/dog-128.png'
              }
              size={32}
              onClicked={() => {
                convRef.current?.showStatusActions?.();
              }}
              userId={'userId'}
            />
          }
          Right={TopNavigationBarRight}
          RightProps={{
            onClicked: () => {
              convRef.current?.showMoreActions?.();
            },
            iconName: 'plus_in_circle',
          }}
          Title={TopNavigationBarTitle({
            text: tr('_uikit_navi_title_chat'),
          })}
        />
      }
    />
  );
}
```

#### Customize List Item

The `ListItemRender` attribute is provided to modify the style and layout of list items.

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        // todo: customize the style of the list items
        return (
          <Pressable
            style={{
              height: 40,
              width: '100%',
              marginVertical: 10,
              backgroundColor: 'red',
            }}
            onPress={() => {
              // todo: customize the click behavior
            }}
            onLongPress={() => {
              // todo: customize the long press behavior
            }}
          />
        );
      }}
    />
  );
}
```

Make the list items support swipe gestures. The `SlideListItem` component is provided in the `uikit`. Example:

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        const { data } = props;
        return (
          <SlideListItem
            height={100}
            leftExtraWidth={100}
            rightExtraWidth={100}
            data={data}
            key={data.convId}
            containerStyle={{
              backgroundColor: 'orange',
            }}
            onPress={() => {
              console.log('test:zuoyu: onPress');
            }}
            onLongPress={() => {
              console.log('test:zuoyu: onLongPress');
            }}
          >
            <View
              style={{
                width: Dimensions.get('window').width + 200,
                height: '100%',
                backgroundColor: 'orange',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  backgroundColor: 'yellow',
                  height: '100%',
                  width: 100,
                }}
              />
              <View
                style={{
                  backgroundColor: 'blue',
                  height: '100%',
                  width: Dimensions.get('window').width,
                }}
              />
              <View />
            </View>
          </SlideListItem>
        );
      }}
    />
  );
}
```

### Message List (Conversation Details)

From a layout perspective, this component includes a navigation bar, a middle message list, a bottom function bar, and a menu that can be hidden.

#### Customize Navigation Bar

This navigation bar component is a universal component. In the chat page, the left component of the navigation bar is an avatar and the right component is a function extension menu. The custom manner and related methods are similar to the conversation list.

#### Customize Message List

For the message list, you can set the background color, background image, and message timestamp, and customize the message style.

1. Customize the background color of the message list

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      list={{
        props: {
          containerStyle: { backgroundColor: 'red' },
        },
      }}
    />
  );
}
```

2. Set a background image for the message list

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      list={{
        props: {
          backgroundImage: 'https://img.yzcdn.cn/vant/cat.jpeg',
        },
      }}
    />
  );
}
```

3. Customize the message timestamp

Set the timestamp below the message bubble, which needs to be done during initialization. Example code:

```tsx
export function App() {
  const { getOptions } = useApp();

  return (
    <UIKitContainer
      options={getOptions()}
      formatTime={{
        locale: enAU,
        conversationDetailCallback(timestamp, enAU) {
          return format(timestamp, 'yyyy-MM-dd HH:mm:ss', { locale: enAU });
        },
      }}
    >
      {/* sub component */}
    </UIKitContainer>
  );
}
```

4. Customize the message styles

Customize the text message style. Example code:

```tsx
export function MyMessageContent(props: MessageContentProps) {
  const { msg, layoutType, isSupport, contentMaxWidth } = props;
  if (msg.body.type === ChatMessageType.TXT) {
    // todo: If it is a text message type, display it using this style.
    return (
      <MessageText
        msg={msg}
        layoutType={layoutType}
        isSupport={isSupport}
        maxWidth={contentMaxWidth}
      />
    );
  }
  return <MessageContent {...props} />;
}

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      list={{
        props: {
          listItemRenderProps: {
            MessageContent: MyMessageContent,
          },
        },
      }}
    />
  );
}
```

To hide the avatar of the message, the sample code is as follows.

For other customizable contents, refer to the `MessageViewProps` attribute.

```tsx
export function MyMessageView(props: MessageViewProps) {
  if (props.model.layoutType === 'left') {
    // todo: If it is a left message, do not display the avatar
    return <MessageView {...props} avatarIsVisible={false} />;
  }
  return MessageView(props);
}

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      list={{
        props: {
          listItemRenderProps: {
            MessageView: MyMessageView,
          },
        },
      }}
    />
  );
}
```

### Contact List

#### Customize Navigation Bar

The navigation bar component is a universal component. On the contact list page, the left and right components are an avatar and menu of extended functions respectively on the navigation bar. The customization manner and related methods are similar to the conversation list.

#### Customize Contact List Items

1. Whether to display the alphabetical index table and the alphabetical navigation list

```tsx
export type MyContactListScreenProps = {};
function MyContactListScreen(props: MyContactListScreenProps) {
  const {} = props;

  return (
    <ContactList
      contactType={'contact-list'}
      isVisibleIndex={false}
      isVisibleItemHeader={false}
    />
  );
}
```

2. Customize the list item style

You can modify properties such as the style, layout, and color.

```tsx
export type MyContactListScreenProps = {};
function MyContactListScreen(props: MyContactListScreenProps) {
  const {} = props;

  return (
    <ContactList
      contactType={'contact-list'}
      ListItemRender={() => (
        <View style={{ height: 20, backgroundColor: 'red' }} />
      )}
    />
  );
}
```

### Contact Information/Group Information

#### Customize Navigation Bar

The navigation bar component is a universal component. On the detail page, the left and right components are a return button and menu of extended functions respectively on the navigation bar. The customization manner and related methods are similar to the conversation list.

#### Customize List Items

The `customItemRender` attribute is provided for modifying list items on the detail page.

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;

  return (
    <ContactInfo
      userId={userId}
      customItemRender={(list) => {
        // todo: Add custom list items
        list.push(
          <View style={{ height: 100, width: 100, backgroundColor: 'green' }} />
        );
        return list;
      }}
    />
  );
}
```

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;

  return (
    <GroupInfo
      groupId={groupId}
      ownerId={ownerId}
      customItemRender={(items) => {
        items.push(
          <View style={{ height: 100, width: 100, backgroundColor: 'green' }} />
        );
        return items;
      }}
    />
  );
}
```

#### Customize Buttons

The detail page provides the `onInitButton` attribute for customizing buttons.

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;

  return (
    <ContactInfo
      userId={userId}
      onInitButton={(items) => {
        items.length = 0;
        items.push(
          <BlockButton key={'1001'} iconName="2_bars_in_circle" text="test" />
        );
        return items;
      }}
    />
  );
}
```

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;

  return (
    <GroupInfo
      groupId={groupId}
      ownerId={ownerId}
      onInitButton={(items) => {
        items.length = 0;
        items.push(
          <BlockButton key={'1001'} iconName="2_bars_in_circle" text="test" />
        );
        return items;
      }}
    />
  );
}
```

### Group Participant List

#### Customize Navigation Bar

The navigation bar component is a universal component. On the group participant page, the left and right components are a return button and a menu of extended functions on the navigation bar. The customization manner and related methods are similar to the conversation list.

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <GroupParticipantList
      groupId={groupId}
      customNavigationBar={
        <TopNavigationBar
          Left={
            <TopNavigationBarLeft onBack={() => {}} content={'participant'} />
          }
          Right={
            isOwner === true ? (
              <View style={{ flexDirection: 'row' }}>
                <Pressable style={{ padding: 6 }}>
                  <IconButton
                    iconName={'person_add'}
                    style={{ width: 24, height: 24 }}
                    onPress={() => {}}
                  />
                </Pressable>
                <View style={{ width: 4 }} />
                <Pressable style={{ padding: 6 }}>
                  <IconButton
                    iconName={'person_minus'}
                    style={{ width: 24, height: 24, padding: 6 }}
                    onPress={() => {}}
                  />
                </Pressable>
              </View>
            ) : null
          }
        />
      }
    />
  );
}
```

#### Customize List Items

Custom group participant list item styles include the layout, color, and style.

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <GroupParticipantList
      groupId={groupId}
      ListItemRender={(props: GroupParticipantListItemProps) => {
        const { data } = props;
        return (
          <View
            style={{
              height: 20,
              width: '100%',
              backgroundColor: 'red',
              marginTop: 10,
            }}
          >
            <Text>{data.memberId}</Text>
          </View>
        );
      }}
    />
  );
}
```

### Functions on Chat/Conversation/New Conversation Page

The context menu on the chat page provides the following main functions: copy message, reply to message, forward message, select multiple messages, translate message, edit text message, report message, delete message, recall message, and create topic.

#### Copy Text Message Content

This menu is used to copy the text message content. This operation is notified to the upper-layer application through callbacks. Example code is as follows:

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      list={{
        props: {
          onCopyFinished: (content: string) => {
            // todo: handle the copied content
          },
        },
      }}
    />
  );
}
```

#### Reply to Message

Click this menu to reply a message. The quoted message will be displayed above the input box. You can input text or emojis, or select an image, file, video, or other media to reply to the message. You can also click the **Cancel** button to cancel the message reply.

#### Forward Message

Click this menu to enter the message forwarding mode. Select the recipients and click the **Forward** button to forward the message.

#### Select Multiple Messages

Click this menu to enter the message multi-selection mode. Select messages to delete or forward in bulk. You can also click the **Cancel** button to cancel the message selection.

#### Edit Text Message

Click this menu to enter the text message editing mode. You can edit the text of the selected message, or click on a blank area to cancel message editing.

#### Translate Text Message

Click this menu to translate the message. Click the menu again to show the original text.

#### Report Message

Click this menu to display the message reporting context menu. Select the corresponding option to report the message.

#### Delete Message

Click this menu to delete the local message. Double check is required for this dangerous operation.

#### Recall Message

Click this menu to recall the sent message within a certain period of time. The default timeout is 120 seconds. After the message is recalled, the recipient can no longer see the original message.

#### Create Topic

In a group chat, click this menu to create a topic. After clicking, you enter the topic creation mode, type a message to send and complete the topic creation. You can also click the **Return** button to cancel the creation.

#### Customize Context Menu

In addition to the default menus provided above, you can add custom menus to the message bubble. The code is as follows:

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      list={{
        props: {
          onInitMenu: (menu) => {
            return [
              ...menu,
              {
                name: 'test',
                isHigh: false,
                icon: 'bell',
                onClicked: () => {
                  // todo: handle menu event
                },
              },
            ];
          },
        },
      }}
    />
  );
}
```

The input component also has a custom menu, which mainly handles sending of messages of various types. Here is an sample code:

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      input={{
        props: {
          onInitMenu: (menu) => {
            return [
              ...menu,
              {
                name: 'test',
                isHigh: false,
                icon: 'bell',
                onClicked: () => {
                  // todo: handle menu event
                },
              },
            ];
          },
        },
      }}
    />
  );
}
```

## Basic Components

The basic components include basic UI components and auxiliary components. As the foundation of business components, the basic UI components can be used to quickly build business components. It is also recommended to use these components to create custom components. Auxiliary components mainly provide media services, type check, property retrieval, and persistence processing.

Basic UI components are located in `packages/react-native-chat-uikit/src/ui` [here](../../../packages/react-native-chat-uikit/src/ui).
Hooks components are located in `packages/react-native-chat-uikit/src/hook` [here](../../../packages/react-native-chat-uikit/src/hook).

## Event Dispatch

When UI components need to be updated with data changes, events are dispatched to notify the corresponding components. This tool is located in `packages/react-native-chat-uikit/src/dispatch`.

For example, when a group's name is changed, the group list, conversation list, chat page, and group details page need to handle this notification to synchronize the name change.

For example, when a contact's remark is modified, the contact list, conversation list, chat page, and contact details page need to handle this notification to synchronize the name change.

Also, custom components need to pay attention to these notification changes.

## Customize Avatar and Nickname

The UIKit components allow you to change nicknames and avatars through passive registration and active invocation.

### Passive Registration

During the initialization phase, register callbacks through `onUsersHandler` and `onGroupsHandler`. Pass in default values and return new values to achieve customization when needed.

[Example Source Code](../../../example/src/demo/hooks/useApp.tsx)

### Active Invocation

When necessary, update custom data via `ChatService.updateDataList` and notify the data changes to the relevant components.
