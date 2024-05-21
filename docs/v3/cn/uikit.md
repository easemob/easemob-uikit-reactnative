[返回父文档](./index.md)

- [UIKit 介绍](#uikit-介绍)
  - [初始化](#初始化)
  - [主题](#主题)
  - [国际化](#国际化)
  - [业务组件](#业务组件)
    - [会话列表（ConversationList）](#会话列表conversationlist)
      - [自定义导航栏](#自定义导航栏)
      - [自定义列表项](#自定义列表项)
    - [消息列表（ConversationDetail）](#消息列表conversationdetail)
      - [自定义导航栏](#自定义导航栏-1)
      - [自定义消息列表](#自定义消息列表)
    - [联系人（ContactList）](#联系人contactlist)
      - [自定义导航栏](#自定义导航栏-2)
      - [自定义联系人列表项](#自定义联系人列表项)
    - [联系人详情（ContactInfo） / 群详情（GroupInfo）](#联系人详情contactinfo--群详情groupinfo)
      - [自定义导航栏](#自定义导航栏-3)
      - [自定义列表项](#自定义列表项-1)
      - [自定义按钮](#自定义按钮)
    - [群组成员(GroupParticipantList)](#群组成员groupparticipantlist)
      - [自定义导航栏](#自定义导航栏-4)
      - [自定义列表项](#自定义列表项-2)
    - [消息 / 会话 / 新会话 / 会话内功能列表（ContextMenu）](#消息--会话--新会话--会话内功能列表contextmenu)
      - [复制文本消息内容](#复制文本消息内容)
      - [回复消息](#回复消息)
      - [转发消息](#转发消息)
      - [多选消息](#多选消息)
      - [编辑文本消息](#编辑文本消息)
      - [翻译文本消息](#翻译文本消息)
      - [举报消息](#举报消息)
      - [删除消息](#删除消息)
      - [撤销消息](#撤销消息)
      - [创建话题](#创建话题)
      - [自定义上下文菜单](#自定义上下文菜单)
  - [基础组件](#基础组件)
  - [事件分发](#事件分发)
  - [自定义头像和昵称](#自定义头像和昵称)
    - [被动注册](#被动注册)
    - [主动调用](#主动调用)

# UIKit 介绍

这里介绍 2.1 版本的 UIKit 组件库。 组件库包括主题、国际化、核心业务 UI 组件、基础 UI 组件、chat 服务组件、事务分发服务组件等。

UIKit 组件库需要先初始化配置在使用。这里介绍核心内容，其它详见定义和类型声明。

## 初始化

初始化部分的参数非常多。必须填写 `appKey`，需要设置是否自动登录，其它参数可选。详见 `ContainerProps` 类型[详见这里](../../../packages/react-native-chat-uikit/src/container/types.tsx)。

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

详见 `example/src/demo/App.tsx` 示例[源码](../../../example/src/demo/App.tsx)。

## 主题

主题主要提供了调色板和主题两个部分。调色板主要负责基础的样式、颜色、布局等。主题是组合调色板的配置的高级选项，最后提供明暗两种风格。

详见 `example/src/demo/App.tsx` 示例[源码](../../../example/src/demo/App.tsx)。

## 国际化

国际化目前提供了中文和英文两种默认内容。支持自定义其它语言包、扩展现有语言内容。

详见 `example/src/demo/App.tsx` 示例[源码](../../../example/src/demo/App.tsx)。

## 业务组件

业务组件是基础组件组成的，主要包括会话列表组件、联系人列表组件、群组列表组件、群成员列表组件、群成员列表组件、好友申请通知列表组件、聊天页面组件、群详情组件、联系人详情组件等。
其中联系人列表组件为复用组件，支持创建群组、创建新会话、邀请多人音视频等操作。聊天页面组件也是复用组件，支持普通聊天模式、话题模式、搜索模式。

示例源码详见 `example/src/demo/screens/ConversationDetailScreen.tsx` 示例[源码](../../../example/src/demo/screens/ConversationDetailScreen.tsx)。

核心组件介绍如下：

| 组件集合名称 | 描述                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| Container    | 入口组件，在应用程序入口使用，设置全局配置和初始化 UI 组件库。                                                       |
| Theme        | 主题组件，由 `Palette` 和 `Theme` 组成，可以配置 UI 组件的颜色和样式。                                               |
| i18n         | 国际化组件，默认提供中英文 UI 组件的国际化内容，支持更改内容和自定义目标语言。                                       |
| biz          | 页面级业务组件集合。包括`ConversationList`,`ContactList`,`GroupList`, `GroupParticipantList`和`ConversationDetail`等 |
| chat         | 消息服务组件。所有关于消息的非页面处理都在这里。                                                                     |
| config       | 配置服务组件。全局配置设置都在这里。                                                                                 |
| dispatch     | 事件分发组件。可以进行组件之间通信。                                                                                 |
| error        | 对错对象。`uikit`里面的错误错误对象都在这里定义。                                                                    |
| hook         | 自定义的钩子组件。为其它组件服务。                                                                                   |

| 页面级组件名称       | 描述                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ConversationList     | 会话列表组件，提供显示和管理会话列表。                                                                               |
| ContactList          | 联系人列表组件，提供显示和管理联系人列表。在联系人列表、新会话、创建群组、添加群成员、分享名片、转发消息页面中复用。 |
| ConversationDetail   | 消息页面组件，可以收发消息、加载历史消息，支持单群聊。在聊天、搜索、话题、创建话题页面中复用。                       |
| GroupList            | 群组列表组件，提供显示和管理群组列表。                                                                               |
| GroupParticipantList | 群成员列表组件，提供显示和管理群成员列表。在添加成员、删除成员、修改群拥有者、多人音视频中复用。                     |
| NewRequests          | 新通知列表组件，接收和处理好友请求处理。                                                                             |
| CreateGroup          | 创建群组组件。                                                                                                       |
| ContactInfo          | 联系人详情组件。                                                                                                     |
| GroupInfo            | 群组详情组件。                                                                                                       |

### 会话列表（ConversationList）

#### 自定义导航栏

![导航栏截图-布局]()

导航栏组件为通用组件，布局为左中右，该组件可以支持自定义左中右组件。左中右组件可以修改样式、布局、行为等。 示例如下：

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

#### 自定义列表项

通过 `ListItemRender` 属性实现列表项的样式、布局修改。

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        // todo: 自定义列表项样式
        return (
          <Pressable
            style={{
              height: 40,
              width: '100%',
              marginVertical: 10,
              backgroundColor: 'red',
            }}
            onPress={() => {
              // todo: 自定义点击行为
            }}
            onLongPress={() => {
              // todo: 自定义长按行为
            }}
          />
        );
      }}
    />
  );
}
```

让列表项支持侧滑手势。其中`SlideListItem`组件在`uikit`里提供。 示例如下：

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

### 消息列表（ConversationDetail）

该组件从布局角度包括 导航栏、中部消息列表、底部功能栏以及可以隐藏的菜单。

#### 自定义导航栏

该导航栏组件为通用组件，在聊天页面,导航栏左边组件为头像、右边为功能扩展菜单。自定义方式和方法和会话列表类似。

#### 自定义消息列表

可以自定义的内容包括设置背景颜色、设置背景图片、设置消息时间戳、自定义消息样式等。

1. 自定义消息列表的背景颜色

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

2. 设置消息列表的背景图片

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

3. 自定义消息时间戳

设置消息气泡下面的时间戳，需要在初始化部分进行。 示例代码如下：

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

4. 自定义消息样式

自定文本消息样式。示例代码如下：

```tsx
export function MyMessageContent(props: MessageContentProps) {
  const { msg, layoutType, isSupport, contentMaxWidth } = props;
  if (msg.body.type === ChatMessageType.TXT) {
    // todo: 如果是文本类型消息，则使用该样式进行显示。
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

如果想要隐藏消息的头像，则示例代码如下：
其它可以自定义的内容可以参考 `MessageViewProps` 属性。

```tsx
export function MyMessageView(props: MessageViewProps) {
  if (props.model.layoutType === 'left') {
    // todo: 如果是左边的消息，则不显示头像
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

### 联系人（ContactList）

#### 自定义导航栏

该导航栏组件为通用组件，在联系人页面,导航栏左边组件为头像、右边为功能扩展菜单。自定义方式和方法和会话列表类似。

#### 自定义联系人列表项

1. 是否显示字母索引表 和 字母导航列表

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

2. 自定义列表项样式

自定义列表项可以实现样式、布局、颜色等属性的修改。

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

### 联系人详情（ContactInfo） / 群详情（GroupInfo）

#### 自定义导航栏

该导航栏组件为通用组件，在详情页面,导航栏左边组件为返回按钮、右边为功能扩展菜单。自定义方式和方法和会话列表类似。

#### 自定义列表项

对于详情页面提供了 属性 `customItemRender` 可以修改列表项。

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;

  return (
    <ContactInfo
      userId={userId}
      customItemRender={(list) => {
        // todo: 增加自定义列表项
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

#### 自定义按钮

对于详情页面，提供了属性 `onInitButton` 自定义按钮。

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

### 群组成员(GroupParticipantList)

#### 自定义导航栏

该导航栏组件为通用组件，在成员页面,导航栏左边组件为返回按钮、右边为功能扩展菜单。自定义方式和方法和会话列表类似。

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

#### 自定义列表项

自定义群成员列表项样式, 包括布局、颜色、样式等。

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

### 消息 / 会话 / 新会话 / 会话内功能列表（ContextMenu）

聊天页面的上下文菜单提供的主要功能包括：复制消息、回复消息、转发消息、多选消息、翻译消息、编辑文本消息、举报消息、删除消息、撤销消息以及创建话题。

#### 复制文本消息内容

该菜单复制文本消息内容。通过回调的方式通知上层应用。 示例代码如下：

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
            // todo: 处理复制的内容
          },
        },
      }}
    />
  );
}
```

#### 回复消息

点击该菜单进入回复消息状态。输入框上方显示将要回复的消息。输入文本、表情、选择图片、文件、视频等执行消息回复。也可以点击取消按钮结束回复状态。

#### 转发消息

点击该菜单进入转发状态。选择转发对象，点击转发按钮，执行转发操作。

#### 多选消息

点击该菜单进入多选模式，选中消息，进行批量删除或者转发。也可以点击取消按钮结束多选模式。

#### 编辑文本消息

点击该菜单进入文本消息编辑模式，可以对选中消息的文本进行编辑。也可以点击空白区域取消消息编辑。

#### 翻译文本消息

点击该菜单会执行目标消息翻译，再次点击该菜单可以显示原文。

#### 举报消息

点击该菜单，显示消息上报上下文菜单，选择对应选项，执行消息上报。

#### 删除消息

点击该菜单，可以删除本地消息。同时由于是危险操作需要二次确认。

#### 撤销消息

点击该菜单，可以在规定时间内撤销发送的消息。默认超时 120 秒。撤销之后，对方无法看到原来的消息。

#### 创建话题

在群组聊天中，点击该菜单，可以创建话题。点击之后进入创建话题状态，输入一条消息执行发送，完成话题创建。也可以点击返回按钮取消创建。

#### 自定义上下文菜单

除了上述提供的默认菜单，还可以添加消息气泡的自定义菜单。代码如下：

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
                  // todo: 处理菜单事件
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

输入组件也有自定义菜单，主要完成发送各种类型的消息。示例代码如下：

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
                  // todo: 处理菜单事件
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

## 基础组件

基础组件包括 UI 基础组件、和辅助组件，UI 基础组件是业务组件组成的基石，可以快速构建业务组件，也推荐用户使用这些组件创建自定义组件，辅助组件主要完成媒体服务、类型检查、属性获取、持久化处理等。

UI 基础组件在 `packages/react-native-chat-uikit/src/ui` [这里](../../../packages/react-native-chat-uikit/src/ui)。
hooks 组件在 `packages/react-native-chat-uikit/src/hook` [这里](../../../packages/react-native-chat-uikit/src/hook)。

## 事件分发

当数据发生变化，UI 组件需要更新，这里使用事件分发通知对应关注的组件。这个工具在 `packages/react-native-chat-uikit/src/dispatch` 这里。

举例：当群修改名称之后，群列表、会话列表、聊天页面、群详情页面等需要处理该通知，同步名称。
举例：当联系人修改备注之后，联系人列表、会话列表、聊天页面、联系人详情页面等需要处理该通知，同步名称。

对于，开发者自定义的组件，也需要关注这些通知的变化。

## 自定义头像和昵称

UIKit 组件提供了修改昵称和头像的机会。主要通过被动注册和主动调用完成。

### 被动注册

在初始化阶段 通过 `onUsersHandler` 和 `onGroupsHandler` 注册回调，在需要调用时候，传递默认值，返回新值的方式完成自定义。

[示例源码](../../../example/src/demo/hooks/useApp.tsx)

### 主动调用

在需要的地方，通过 `ChatService.updateDataList` 更新自定义数据，并且通知关注的组件。
