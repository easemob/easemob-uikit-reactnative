[返回父文档](./index.md)

- [Chatroom UIKit SDK 介绍](#chatroom-uikit-sdk-介绍)
  - [最低要求](#最低要求)
  - [项目结构](#项目结构)
  - [命名约定](#命名约定)
  - [组件概览](#组件概览)
  - [组件列表](#组件列表)
    - [主题介绍](#主题介绍)
    - [国际化介绍](#国际化介绍)
    - [初始化介绍](#初始化介绍)
    - [Chatroom 组件](#chatroom-组件)
    - [MessageList 组件](#messagelist-组件)
    - [ParticipantList 组件](#participantlist-组件)
    - [GiftMessageList 组件](#giftmessagelist-组件)
    - [GlobalBroadcast 组件](#globalbroadcast-组件)
    - [MessageInput 组件](#messageinput-组件)
    - [BottomToolbar 组件](#bottomtoolbar-组件)
    - [BottomSheetGift 组件](#bottomsheetgift-组件)
    - [ReportMessage 组件](#reportmessage-组件)
  - [组件自定义](#组件自定义)
    - [自定义 GiftMessageList 组件](#自定义-giftmessagelist-组件)
    - [自定义 GlobalBroadcast 组件](#自定义-globalbroadcast-组件)
    - [自定义消息列表项样式](#自定义消息列表项样式)
    - [自定义聊天室成员列表项样式](#自定义聊天室成员列表项样式)

# Chatroom UIKit SDK 介绍

该项目为 `Chatroom UIKit SDK`, 简称 `UIKit`。在 `Chat SDK` 基础上提供了聊天室 UI 组件的集合。可以帮助用户更快的搭建聊天室应用。

## 最低要求

使用该项目的要求：

- MacOS 12 或以上版本
- React-Native 0.66 或以上版本
- NodeJs 16.18 或以上版本

对于 `iOS` 应用：

- Xcode 13 或以上版本，以及它的相关依赖工具。

对于 `Android` 应用：

- Android Studio 2021 或以上版本，以及它的相关依赖工具。

## 项目结构

项目的主要结构如下：

```sh
.
├── biz // 含有业务的UI组件, 例如：聊天室一级组件、成员列表二级组件等。
├── config // 全局配置服务，例如：是否激活 `UIKit` 日志。
├── container // UIKit 入口 组件
├── dispatch // 事件分发服务，可以在联系紧密的组件间发送接收通知。
├── error // 错误对象，提供统一的错误码。
├── hook // Function组件工具，Class组件无法使用。
├── i18n // 国际化服务
├── room //  Chat SDK 服务，提供更加便捷的使用，提供统一的错误处理。
├── theme // 主题服务，提供light和dark主题，可以自定义基本色。
├── ui // 基础 UI 组件，其它高级组件的基础支撑，支持主题。
└── utils // 工具集合
```

![svg](../chatroom_architecture.svg)

## 命名约定

组件也是有多种分类的，根据 React-Native 的使用习惯，这里列举说明主要的命名约定。

- index.tsx 为对象的导出文件
- types.tsx 为类型声明的导出文件
- const.tsx 为常量文件，通常不对外
- Context：为数据共享的上下文对象。主题、国际化等都是通过该方式提供服务的。
- Provider：为数据共享的提供者对象
- Consumer：为数据共享的消费者对象
- Container：为 `UIKit` 的入口组件。集成了所有其他内部提供的服务和组件，使用者需要首先使用该组件进行初始化等操作。
- use 开头的：hook 工具，Function 组件使用，Class 组件不能使用。本 `UIKit` 主要以 `Function` 组件为主。
- 后缀 Props：为 UI 组件的参数类型
- 后缀 Memo：为 UI 带缓存的组件的类型
- 后缀 Ref：为 UI 组件的引用，可以控制组件行为。例如：获取焦点、显示模态窗口。
- 后缀 Model：为 UI 组件的参数里面的数据类型。
- 后缀 Service：为非 UI 组件。提供一定服务。例如：RoomService。

## 组件概览

`Chatroom UIKit SDK` 的组件大体划分为 UI 组件和非 UI 组件。 UI 组件主要用来显示内容，非 UI 组件主要完成具体功能。
从使用者的角度来说可以分为直接使用的组件和间接使用的组件，例如，`Chatroom`组件是直接使用的组件，`ParticipantList`组件是间接使用的组件。
从组件构成的角度上说，组件又可以分为顶级组件、业务组件和基础组件。例如，`Chatroom` 组件就顶级组件，`MessageList`是业务组件，`SlideModal`是基础组件。
从组件的大小的角度又可以划分为页面级组件和非页面级组件。页面级组件会占用整个屏幕的大小。例如：`Chatroom`组件是页面级组件，其它为非页面级组件，
还有一类特殊的组件，他们无法和其它同类组件共存，他们是 `Modal`组件。
还有一些组件对约束是有要求的。例如：`ScrollView` 需要指定高度，或者父类有确定的高度。

![chatroom_overview_tag](../chatroom_overview_tag.jpg)

| UI 基础通用组件 | Function/Class   | 是否基础 | 是否页面 | 是否弹出 | 位置 | 大小 | 样式 | 控制 | 自定义 | 说明                                                |
| --------------- | ---------------- | -------- | -------- | -------- | ---- | ---- | ---- | ---- | ------ | --------------------------------------------------- |
| Text            | Function         | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ✅     | 文本基础组件：接近原生，支持主题                    |
| TextInput       | Function         | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ✅   | ✅     | 文本输入基础组件：原生 android 无法符合设计要求     |
| TabPage         | Function         | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ❌     | tab 页面组件：原生没有,新增支持懒加载               |
| Modal           | Function         | ✅       | ❌       | ✅       | ✅   | ✅   | ✅   | ✅   | ✅     | 模态组件：原生不符合设计要求,增加非模态的相似组件。 |
| Image           | Function & Class | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ✅     | 图片组件：接近原生，自定义失败处理                  |
| Button          | Function         | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ❌     | 按钮组件：接近 Pressable，支持主题                  |
| FlatList        | Function         | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ✅   | ✅     | 原生没有错误页面和加载页面。                        |

| UI 基础复合组件 | Function/Class | 是否基础 | 是否页面 | 是否弹出 | 位置 | 大小 | 样式 | 控制 | 自定义 | 说明                           |
| --------------- | -------------- | -------- | -------- | -------- | ---- | ---- | ---- | ---- | ------ | ------------------------------ |
| Alert           | Function       | ✅       | ❌       | ✅       | ❌   | ❌   | ❌   | ❌   | ❌     | 警告框组件：原生不符合设计要求 |
| Avatar          | Function       | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ❌     | 头像：如果失败，加载默认头像   |
| GiftIcon        | Function       | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ❌     | 礼物：如果失败，加载默认       |
| BottomSheetMenu | Function       | ✅       | ❌       | ✅       | ❌   | ❌   | ✅   | ✅   | ❌     | 上下文菜单：模态               |
| Placeholder     | Function       | ✅       | ❌       | ❌       | ✅   | ✅   | ❌   | ❌   | ❌     | 占位组件                       |
| EmojiList       | Function       | ✅       | ❌       | ❌       | ✅   | ✅   | ✅   | ❌   | ❌     | emoji 选择列表                 |
| GiftList        | Function       | ✅       | ❌       | ⭕️      | ✅   | ✅   | ❌   | ❌   | ❌     | 礼物选择列表                   |
| GlobalBroadcast | Function       | ✅       | ❌       | ❌       | ✅   | ✅   | ⭕️  | ✅   | ✅     | 消息广播组件                   |
| Report          | Function       | ✅       | ❌       | ⭕️      | ❌   | ❌   | ❌   | ✅   | ❌     | 消息上报组件                   |
| GiftMessageList | Function       | ✅       | ❌       | ❌       | ✅   | ❌   | ❌   | ✅   | ❌     | 礼物特效组件                   |

| UI 业务组件     | Function/Class | 是否基础 | 是否页面 | 是否弹出 | 位置 | 大小 | 样式 | 控制 | 自定义 | 说明                       |
| --------------- | -------------- | -------- | -------- | -------- | ---- | ---- | ---- | ---- | ------ | -------------------------- |
| MessageInput    | Function       | ❌       | ❌       | ❌       | ❌   | ❌   | ❌   | ✅   | ❌     | 输入框组件                 |
| BottomToolbar   | Function       | ❌       | ❌       | ❌       | ❌   | ❌   | ⭕️  | ✅   | ❌     | 输入框样式组件             |
| ParticipantList | Function       | ❌       | ❌       | ⭕️      | ❌   | ❌   | ⭕️  | ✅   | ✅     | 成员列表组件               |
| MessageList     | Function       | ❌       | ❌       | ❌       | ✅   | ✅   | ⭕️  | ✅   | ✅     | 聊天室消息区组件域         |
| Chatroom        | Class          | ❌       | ✅       | ❌       | ❌   | ❌   | ⭕️  | ✅   | ✅     | 聊天室组件：所有组件的入口 |

说明：✅ 是 ❌ 否 ⭕️ 都可以

- 是否基础：UI 组件主要分为基础 UI 组件和业务 UI 组件。其中基础 UI 组件通用性更强，可以组成更复杂的组件。业务 UI 组件除了具有 UI，还包含一定的业务逻辑。
- 是否页面：独立的 UI 组件主要分为页面级 UI 组件和普通 UI 组件。页面级 UI 组件通常占用整个屏幕，可以在上面添加子组件。例如：Chatroom 组件就是页面级 UI 组件。
- 是否弹出：UI 组件处理交互的方式可以分为模态组件和非模态组件。模态组件需要处理完成当前的交互才可以进入下一个页面。目前 RN 模态仅支持但模态处理。android 是支持多模态处理的。
- 位置：组件支持调整位置，可以通过 flex 布局实现。flex 分为绝对布局和相对布局。
- 大小：组件支持大小调整。最大值、最小值和固定值。例如：maxHeight、minHeight、height。
- 样式：主要是指组件的颜色、margin、padding、border、color 等。
- 控制：可以主动调用组件提供的方法。通常组件通过用户的点击、拖动手势触发响应，但是输入框的焦点通常需要组件提供的方法来改变焦点。
- 自定义：通常使用调用者提供的自定义组件替换默认内置组件，实现最大化的自定义。

| List UI 组件    | 大小 | 是否为空 | 支持搜索 | 自定义 Item | 下拉刷新 | 触底加载 | 点击事件 | 长按事件 | 侧滑事件 | 自定义 | 空页面 | 错误页面 | 说明               |
| --------------- | ---- | -------- | -------- | ----------- | -------- | -------- | -------- | -------- | -------- | ------ | ------ | -------- | ------------------ |
| EmojiList       | ✅   | ❌       | ❌       | ❌          | ❌       | ❌       | ✅       | ❌       | ❌       | ✅     | ❌     | ❌       | emoji 列表组件     |
| GiftList        | ✅   | ❌       | ❌       | ✅          | ❌       | ❌       | ✅       | ❌       | ❌       | ✅     | ❌     | ❌       | 礼物列表组件       |
| ParticipantList | ✅   | ✅       | ✅       | ✅          | ✅       | ✅       | ✅       | ❌       | ❌       | ✅     | ✅     | ✅       | 成员列表组件       |
| MessageList     | ✅   | ✅       | ❌       | ✅          | ❌       | ❌       | ❌       | ✅       | ❌       | ✅     | ❌     | ❌       | 聊天室消息区域组件 |

说明：✅ 是 ❌ 否 ⭕️ 都可以

- 大小：参考上面。
- 是否为空：如果 List 没有数据，显示空页面。
- 支持搜索：支持搜索组件过滤列表项。
- 自定义 Item：通常使用调用者提供的自定义 Item 组件替换默认的组件，实现 Item 的自定义，包括手势事件、显示样式等。
- 下拉刷新：通过下拉刷新可以重置数据。
- 触底加载：通过触底触发更多数据加载。
- 点击事件：点击 Item 触发的事件。
- 长按事件：长按 Item 触发的事件。
- 侧滑事件：侧滑手势触发的事件。
- 自定义：参考上面

| 服务组件   | 使用 | 扩展 | 重载 | 自定义 | 说明         |
| ---------- | ---- | ---- | ---- | ------ | ------------ |
| config     | ✅   | ❌   | ❌   | ❌     | 全局配置选项 |
| dispatch   | ✅   | ❌   | ❌   | ❌     | 事件分发服务 |
| i18n       | ✅   | ✅   | ✅   | ❌     | 国际化服务   |
| im         | ✅   | ✅   | ✅   | ❌     | IM 服务      |
| log        | ✅   | ❌   | ❌   | ❌     | 日志服务     |
| permission | ✅   | ✅   | ✅   | ❌     | 权限服务     |
| theme      | ✅   | ❌   | ❌   | ❌     | 主题服务     |
| container  | ✅   | ❌   | ❌   | ❌     | 所有服务入口 |

说明：✅ 是 ❌ 否 ⭕️ 都可以

- 使用：仅仅提供初始化的配置项，或者不提供，通过使用组件提供的方法。
- 扩展：除了使用提供的，还可以扩展组件的功能。
- 重载：除了使用提供的，还可以覆盖掉原来组件的功能，提供不一样的结果。
- 自定义：除了使用、扩展、重载提供以外的方式方法。

| 其它组件 | 使用 | 扩展 | 重载 | 自定义 | 说明                              |
| -------- | ---- | ---- | ---- | ------ | --------------------------------- |
| error    | ✅   | ❌   | ❌   | ❌     | 提供 uikit 统一错误对象以及错误码 |
| hooks    | ✅   | ❌   | ❌   | ❌     | 自定义 hook                       |
| dev tool | ✅   | ❌   | ❌   | ❌     | 开发测试验证工具                  |
| utils    | ✅   | ❌   | ❌   | ❌     | 其它工具                          |

## 组件列表

`room uikit sdk` 主要包括如下组件：

| 组件名称        | 组件介绍                                                             | 链接                                |
| --------------- | -------------------------------------------------------------------- | ----------------------------------- |
| Theme           | 可以设置`UIKit`所有组件的颜色、样式、可以切换 `light` 和`dark`主题。 | [主题介绍](#主题介绍)               |
| I18n            | 可以设置`UIKit`所有 UI 组件的语言。                                  | [国际化介绍](#国际化介绍)           |
| Chatroom        | 聊天室组件，集成了礼物发送、消息列表、成员列表、礼物接收等组件。     | [Chatroom](#Chatroom)               |
| MessageList     | 聊天室的消息列表显示组件，用来显示发送或者接收到的消息。             | [MessageList](#MessageList)         |
| ParticipantList | 聊天室的成员列表组件，包括聊天室成员和禁言成员的管理。               | [ParticipantList](#ParticipantList) |
| GiftMessageList | 打赏消息列表组件，用来显示打赏的礼物。                               | [GiftMessageList](#GiftMessageList) |
| GlobalBroadcast | 聊天室全局广播组件，所有的聊天室都会收到。                           | [GlobalBroadcast](#GlobalBroadcast) |
| MessageInput    | 消息输入组件，用来发送各类消息。                                     | [MessageInput](#MessageInput)       |
| BottomToolbar   | 底部功能区域组件，可以切换消息输入组件，可以添加自定义按钮。         | [BottomToolbar](#BottomToolbar)     |
| BottomSheetGift | 发送礼物组件，可以发送礼物，礼物来源由开发者指定。                   | [BottomSheetGift](#BottomSheetGift) |
| ReportMessage   | 消息上报组件。                                                       | [BottomSheetGift](#BottomSheetGift) |

### 主题介绍

每个 UI 组件都会用到主题，主题服务提供了`light`和`dark`主题。支持一键切换。

简单示例如下：

```tsx
// ...
// 定义主题设置状态
const palette = usePresetPalette();
const dark = useDarkTheme(palette);
const light = useLightTheme(palette);
const [theme, setTheme] = React.useState(light);
// ...
// 添加组件到渲染树
<Container appKey={env.appKey} palette={palette} theme={theme} />;
// ...
// 更改主题设置
setTheme(theme === light ? dark : light);
```

自定义主题颜色。 `usePresetPalette` 可以使用内置的默认主题颜色，也可以使用 `useCreatePalette` 设置自定义主题颜色。

```tsx
// 自定义颜色。通过修改颜色具体值，组件中对应颜色将统一改变。
// 参考这里：https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?type=design&node-id=101-41012&mode=design&t=Fzou3Gwsk4owLLbr-4
const { createPalette } = useCreatePalette({
  colors: {
    primary: 203,
    secondary: 155,
    error: 350,
    neutral: 203,
    neutralSpecial: 220,
  },
});
const palette = createPalette();
// ...
```

### 国际化介绍

UIKit 支持多国语言切换，目前内置中文和英文。支持扩展其他语言。

例如：想要让 UIKit 使用英文显示，可以如下设置：

```tsx
<Container appKey={env.appKey} language={'en'} />
```

语言设置规则：

- 如果没有设置语言，则使用默认系统语言。
- 如果系统语言不是中文或者英文，则国内选择中文，国外选择英文。
- 如果设置语言不是中文或者英文，并且没有提供相应的语言集合，则国内选择中文，国外选择英文。

例如：如果应用开发者需要设置中文语言，并且希望应用本身也能够使用，可以这样设置：

```tsx
// ...
// 创建应用需要的语言包
function createLanguage(type: LanguageCode): StringSet {
  return {
    'Chinese text.': '中文文本.',
  };
}
// ...
// 设置指定语言集合，并且提供语言翻译源
<Container
  appKey={env.appKey}
  language={'zh-Hans'}
  languageExtensionFactory={createLanguage}
/>;
// ...
// 在需要国际化的地方
const { tr } = useI18nContext();
return <Text>{tr('Chinese text.')}</Text>;
```

例如：如果应用开发者想要设置法语，并且希望应用和 UIKit 都显示法语，可以这样设置：

```tsx
// ...
// 创建应用扩展语言集合
function createAppLanguage(type: LanguageCode): StringSet {
  if (type === 'fr') {
    return {
      'French text.': 'Texte français.',
    };
  }
  return {
    'French text.': 'French text.',
  };
}
// 创建UIKit的语言集合，需要找到UIKit内置的文件 `StringSet.en.tsx`, 将所有的 `value` 修改为法语版本。
export function createUIKitLanguage(type: LanguageCode): StringSet {
  if (type === 'fr') {
    return {
      'Private Chat': 'Private Chat',
      '...': '...',
    };
  }
}
// ...
// 设置指定语言集合，并且提供语言翻译源
<Container
  appKey={env.appKey}
  language={'fr'}
  languageBuiltInFactory={createUIKitLanguage}
  languageExtensionFactory={createAppLanguage}
/>;
```

### 初始化介绍

`Chatroom UIKit SDK` 的入口就是 `Container` 组件，它主要负责集成其他组件和参数配置。

```tsx
export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  language?: StringSetType;
  languageBuiltInFactory?: CreateStringSet;
  languageExtensionFactory?: CreateStringSet;
  palette?: Palette;
  theme?: Theme;
  roomOption?: PartialRoomOption;
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  fontFamily?: string;
  onInitialized?: () => void;
}>;
```

```tsx
// 主要控制聊天室组件里面的组件是否加载。
export type RoomOption = {
  globalBroadcast: {
    isVisible: boolean;
  };
  gift: {
    isVisible: boolean;
  };
  messageList: {
    isVisibleGift: boolean;
    isVisibleTime: boolean;
    isVisibleTag: boolean;
    isVisibleAvatar: boolean;
  };
};
```

除了 `appKey` 之外都是可选参数。

- isDevMode: 如果设置为 `true`，则激活日志打印等工具。
- language: 设置当前的语言，如果没有设置，则获取系统当前的语言作为默认值。
- languageBuiltInFactory: 如果没有设置则使用内置的语言资源。通常可以修改内置的 UI 内容。
- languageExtensionFactory: 如果设置将扩展语言资源。通常应用的 UI 也需要国际化。
- palette: 设置当前的调色板，主题服务的重要依赖。
- theme: 如果没有设置主题，将使用 `light` 为默认主题。
- roomOption: 聊天室选项。具体参见 全局配置服务。
- avatar: 设置全局头像的圆角样式
- fontFamily: 支持自定义字体。默认使用系统字体。
- onInitialized：初始化完成的回调通知

全局配置参数。

- globalBroadcast: 全局广播组件配置，可以设置是否加载。
- gift: 打赏消息列表组件，可以设置是否加载。
- messageList: 消息列表组件配置
  - isVisibleGift: 是否加载打赏消息组件。
  - isVisibleTime: 是否显示时间标签。
  - isVisibleTag: 是否显示 tag 标签。
  - isVisibleAvatar: 是否显示头像标签。

通常 `Container` 会处于应用的底层，一般为根组件，或者是根组件同一级别。例如：

```tsx
export function App() {
  return <Container appKey={'your app key'}>{children}</Container>;
}
```

### Chatroom 组件

聊天室组件是包括成员列表组件、输入组件、消息列表组件、打赏消息组件、全局广播通知组件、菜单组件等的集合。它是一个页面级组件，基本占据了这个屏幕。如果想要添加组件，建议成为它的子组件或者背景组件。

简单示例如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<Chatroom>({} as any);
// ...
// 添加组件到渲染树
<Chatroom ref={chatroomRef} roomId={room.roomId} ownerId={room.owner} />;
```

由于 `UIKit` 没有路由 （`React-Native` 没有内置），所以，这里如果需要进行成员搜索，需要像下面这样设置。

```tsx
<Chatroom
  ref={chatroomRef}
  participantList={{
    props: {
      onSearch: (memberType) => {
        // todo: 点击搜索按钮跳转到搜索页面
        navigation.push('SearchParticipant', { params: { memberType } });
      },
    },
  }}
  roomId={room.roomId}
  ownerId={room.owner}
/>
```

`Chatroom`提供的属性概览

| 属性                       | 是否可选 | 介绍                                                 |
| -------------------------- | -------- | ---------------------------------------------------- |
| containerStyle             | 可选     | 设置组件容器样式。支持背景、位置、大小、边框等的设置 |
| GiftMessageList            | 可选     | 打赏消息组件的渲染器                                 |
| GlobalBroadcast            | 可选     | 全局广播组件的渲染器                                 |
| MessageList                | 可选     | 消息列表组件的渲染器                                 |
| MessageInput               | 可选     | 输入组件的渲染器                                     |
| BottomSheetParticipantList | 可选     | 成员列表组件的渲染器                                 |
| input                      | 可选     | 输入组件的属性                                       |
| messageList                | 可选     | 消息列表的属性                                       |
| globalBroadcast            | 可选     | 聊天室全局广播                                       |
| gift                       | 可选     | 打赏消息的属性                                       |
| participantList            | 可选     | 成员列表的属性                                       |
| backgroundView             | 可选     | 背景组件                                             |

`Chatroom`提供的方法概览

| 方法                  | 介绍                                       |
| --------------------- | ------------------------------------------ |
| getGlobalBroadcastRef | 获取`GlobalBroadcast`的组件引用            |
| getGiftMessageListRef | 获取`GiftMessageList`的组件引用            |
| getParticipantListRef | 获取`BottomSheetParticipantList`的组件引用 |
| getMessageListRef     | 获取`MessageList`的组件引用                |
| joinRoom              | 加入聊天室                                 |
| leaveRoom             | 退出聊天室                                 |

![chatroom](../res/chatroom.png)

### MessageList 组件

聊天室消息区域组件`MessageList`提供消息的显示，聊天室接收到的文本消息、表情消息、礼物消息，发送成功的消息会显示在这里。

消息列表可以对消息进行操作。例如：翻译文本消息为目标语言、撤销消息、消息上报等。 通过长按消息列表项弹出菜单进行相应操作。

数据上报组件支持自定义选项，可以自定义选项上报不同内容。

简单使用示例：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<MessageListRef>({} as any);
// 添加消息列表组件到渲染树
<MessageList ref={ref} />;
// ...
// 添加消息到消息列表，消息会显示在列表
ref?.current?.addSendedMessage?.(message);
```

`MessageList`提供的属性概览

| 属性                     | 是否可选 | 介绍                                                            |
| ------------------------ | -------- | --------------------------------------------------------------- |
| visible                  | 可选     | 设置组件是否可见                                                |
| onUnreadCount            | 可选     | 未读数发生变化时的回调通知                                      |
| onLongPressItem          | 可选     | 长按消息列表项时的回调通知                                      |
| containerStyle           | 可选     | 设置组件容器样式。支持背景、位置、大小、边框等的设置            |
| onLayout                 | 可选     | 组件布局发生变化时的回调通知                                    |
| MessageListItemComponent | 可选     | 消息列表项的渲染器                                              |
| reportProps              | 可选     | 消息上报的属性                                                  |
| maxMessageCount          | 可选     | 组件可以显示的最大消息数，默认 1000，超过限制后将回收最早消息。 |
| messageMenuItems         | 可选     | 自定义消息菜单项，追加到内置菜单后面                            |

`MessageList`提供的方法概览

| 方法             | 介绍                             |
| ---------------- | -------------------------------- |
| addSendedMessage | 将输入框里面的内容发送到消息列表 |
| scrollToEnd      | 滚动消息列表到底部               |

![message_context_menu](../res/chatroom_message_context_menu.png)
![message_report](../res/chatroom_message_report.png)

### ParticipantList 组件

聊天室成员组件可以显示和管理聊天室成员，房间拥有者还有禁言列表以及管理权限。

房间拥有者可以更改成员状态。例如：对某个成员禁言，将某个成员踢出聊天室。

**注意** 聊天室成员列表组件的显示的入口并不在 `UIKit`, 所以，需要应用开发者自行实现。例如：添加一个按钮点击触发显示聊天室成员列表组件。

`BottomSheetParticipantList`组件是 `SimulativeModal` 和 `ParticipantList` 组成的。是一个独立的组件，可以进行显示和隐藏。

简单示例如下：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<BottomSheetParticipantListRef>({} as any);
// 添加成员列表组件到渲染树
<BottomSheetParticipantList ref={this.ref} />;
// ...
// 用户实现现实具体动作，例如：添加按钮，点击按钮显示成员列表组件。
ref?.current?.startShow?.();
```

`BottomSheetParticipantList`提供的属性概览

| 属性                | 是否可选 | 介绍                                                 |
| ------------------- | -------- | ---------------------------------------------------- |
| onSearch            | 可选     | 点击搜索样式的回调通知                               |
| onNoMoreMember      | 可选     | 下滑加载更多成员时，没有更多成员的回调通知           |
| containerStyle      | 可选     | 设置组件容器样式。支持背景、位置、大小、边框等的设置 |
| maskStyle           | 可选     | 设置组件容器以外区域样式。                           |
| MemberItemComponent | 可选     | 成员列表项的渲染器                                   |

`BottomSheetParticipantList`提供的方法概览

| 方法                  | 介绍                             |
| --------------------- | -------------------------------- |
| startShow             | 显示组件                         |
| startHide             | 隐藏组件，隐藏动画完成后返回通知 |
| getParticipantListRef | 获取引用                         |

`ParticipantList`提供的方法概览。

| 方法         | 介绍                                           |
| ------------ | ---------------------------------------------- |
| initMenu     | 初始化自定义成员列表菜单，追加到内置菜单的后面 |
| removeMember | 删除成员                                       |
| muteMember   | 禁言或者解除禁言成员                           |
| closeMenu    | 关闭菜单                                       |

![member_list](../res/chatroom_member_list.png)
![member_context_menu](../res/chatroom_member_context_menu.png)

### GiftMessageList 组件

打赏消息组件用来展示发送的礼物效果，礼物消息可以显示在消息列表，也可以显示在该组件。

简单使用示例：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<GiftMessageListRef>({} as any);
// 添加组件到渲染树
<GiftMessageList ref={ref} />;
// ...
// 添加礼物消息到组件消息队列中，排队显示。
ref.current?.pushTask({
  model: {
    id: seqId('_gf').toString(),
    nickName: 'NickName',
    giftCount: 1,
    giftIcon: 'http://notext.png',
    content: 'send Agoraship too too too long',
  },
});
```

`GiftMessageList`提供的属性概览

| 属性                    | 是否可选 | 介绍                                           |
| ----------------------- | -------- | ---------------------------------------------- |
| visible                 | 可选     | 设置组件是否可见                               |
| containerStyle          | 可选     | 设置组件容器样式。支持背景、位置、边框等的设置 |
| GiftEffectItemComponent | 可选     | 打赏消息列表项的渲染器                         |

`GiftMessageList`提供的方法概览

| 方法     | 介绍                                 |
| -------- | ------------------------------------ |
| pushTask | 将礼物消息任务添加到队列中，排队加载 |

### GlobalBroadcast 组件

全局广播通知组件接收和现实全局全局广播。也是通过添加消息到队列排队显示。

简单示例如下：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<GlobalBroadcastRef>({} as any);
// ...
// 添加组件到渲染树
<GlobalBroadcast ref={ref} />;
// ...
// 将消息添加到任务队列，排队显示。
let count = 1;
ref.current?.pushTask?.({
  model: {
    id: count.toString(),
    content: count.toString() + content,
  },
});
```

`GlobalBroadcast`提供的属性概览

| 属性                    | 是否可选 | 介绍                                                 |
| ----------------------- | -------- | ---------------------------------------------------- |
| visible                 | 可选     | 设置组件是否可见                                     |
| playSpeed               | 可选     | 消息播放时滚动的速度，默认值 8                       |
| containerStyle          | 可选     | 设置组件容器样式。支持背景、位置、大小、边框等的设置 |
| textStyle               | 可选     | 设置组件文本样式                                     |
| icon                    | 可选     | 设置组件上的图标样式                                 |
| GiftEffectItemComponent | 可选     | 打赏消息列表项的渲染器                               |
| onFinished              | 可选     | 所有消息播放完成时的回调通知                         |
| onLayout                | 可选     | 组件布局发生变化时的回调通知                         |

`GlobalBroadcast`提供的方法概览

| 方法     | 介绍                         |
| -------- | ---------------------------- |
| pushTask | 将消息添加到队列中，排队加载 |

### MessageInput 组件

输入框组件可以发送文本、表情消息。 同时和 输入框组件组合为可以动态切换的组件。当点击输入框样式组件时切换到输入状态，发送消息或者关闭输入框时切换为输入框样式组件。

简单示例如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<MessageInputRef>({} as any);
// ...
// 添加组件到渲染树
<MessageInput
  ref={ref}
  onSended={(_content, message) => {
    // todo: 调用消息列表引用对象添加消息到消息列表
  }}
/>;
// ...
// 关闭输入状态
ref?.current?.close?.();
```

`MessageInput`提供的属性概览

| 属性                   | 是否可选 | 介绍                                          |
| ---------------------- | -------- | --------------------------------------------- |
| onInputBarWillShow     | 可选     | 将要切换为输入状态时的回调通知                |
| onInputBarWillHide     | 可选     | 将要切换为输入样式状态时的回调通知            |
| onSended               | 可选     | 发送完成时的回调通知                          |
| keyboardVerticalOffset | 可选     | 键盘偏移量的数值                              |
| closeAfterSend         | 可选     | 发送消息后是否切换为输入样式状态              |
| first                  | 可选     | 输入样式组件的第一个自定义组件                |
| after                  | 可选     | 输入样式组件的后面的自定义组件列表，最多 3 个 |
| onLayout               | 可选     | 输入样式组件布局发生变化时的回调通知          |

`MessageInput`提供的方法概览

| 方法  | 介绍                                 |
| ----- | ------------------------------------ |
| close | 主动关闭输入状态，切换为输入样式状态 |

![input_bar](../res/chatroom_input_bar.png)
![emoji_list.png](../res/chatroom_emoji_list.png)

### BottomToolbar 组件

输入样式组件。和输入框组件组成了复合组件，可以动态进行切换。

### BottomSheetGift 组件

礼物列表组件提供自定义礼物列表，点击礼物项的发送按钮发送到聊天室。

**注意** 礼物列表组件是一个独立的组件，需要应用开发者自行实现显示和加载等操作。

简单示例如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<BottomSheetGiftSimuRef>({} as any);
// ...
// 添加组件到渲染树
<BottomSheetGift
  ref={ref}
  gifts={[
    {
      title: 'gift1',
      gifts: [
        {
          giftId: '2665752a-e273-427c-ac5a-4b2a9c82b255',
          giftIcon:
            'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift1.png',
          giftName: 'Sweet Heart',
          giftPrice: 1,
        },
      ],
    },
  ]}
  onSend={(giftId) => {
    // todo: 发送选择的礼物。
  }}
/>;
// ...
// 显示礼物列表组件
ref?.current?.startShow?.();
```

**注意：发送礼物组件提供了 `BottomSheetGift` 和 `BottomSheetGift2`，它们的区别是模态组件还是非模态组件。**

`BottomSheetGift`提供的属性概览

| 属性      | 是否可选 | 介绍                       |
| --------- | -------- | -------------------------- |
| gifts     | 可选     | 礼物列表数组               |
| maskStyle | 可选     | 设置组件容器以外区域样式。 |
| onSend    | 可选     | 点击发送按钮时的回调通知   |

`BottomSheetGift`提供的方法概览

| 方法              | 介绍                             |
| ----------------- | -------------------------------- |
| startShow         | 显示组件                         |
| startShowWithInit | 显示组件，同时可以初始化列表     |
| startHide         | 隐藏组件，隐藏动画完成后返回通知 |

![gift_list](../res/chatroom_gift_list.png)

### ReportMessage 组件

消息上报组件，可以设置上报内容。

简单使用示例：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<BottomSheetMessageReport>({} as any);
// ...
// 添加组件到渲染树
<BottomSheetMessageReport
  ref={ref}
  onReport={getOnReport.onReport}
  data={getReportData}
/>;
// ...
// 显示组件
ref?.current?.startShow?.();
// ...
// 选择列表项，确认上报。
```

`BottomSheetMessageReport`提供的属性概览

| 属性           | 是否可选 | 介绍                                                 |
| -------------- | -------- | ---------------------------------------------------- |
| data           | 可选     | 上报内容列表数组                                     |
| maskStyle      | 可选     | 设置组件容器以外区域样式。                           |
| containerStyle | 可选     | 设置组件容器样式。支持背景、位置、大小、边框等的设置 |
| onReport       | 可选     | 点击上报按钮时的回调通知                             |

`BottomSheetMessageReport`提供的方法概览

| 方法      | 介绍                             |
| --------- | -------------------------------- |
| startShow | 显示组件                         |
| startHide | 隐藏组件，隐藏动画完成后返回通知 |

![message_report](../res/chatroom_message_report.png)

## 组件自定义

### 自定义 GiftMessageList 组件

Chatroom 组件由其他组件组成，这些组件可能无法满足需求，那么，可以替换它。例如：替换 GiftMessageList 组件。只要满足约束 GiftMessageListComponent 就可以。替换的组件可以实现自定义的业务逻辑、实现自定义的样式。
例如：

```tsx
export const MyGiftMessageList: GiftMessageListComponent = React.forwardRef<
  GiftMessageListRef,
  GiftMessageListProps
>(function (
  props: GiftMessageListProps,
  ref?: React.ForwardedRef<GiftMessageListRef>
) {
  // todo: Implement your own business logic, or modify existing business logic.
  const {} = props;
  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GiftMessageListTask) => {
          // todo: Implement this interface.
        },
      };
    },
    []
  );
  return <></>;
});
```

替换默认 GiftMessageList 组件

```tsx
<Chatroom GiftMessageList={MyGiftMessageList} />
```

### 自定义 GlobalBroadcast 组件

全局广播消息的组件 GlobalBroadcast 替换。 只要满足约束 GlobalBroadcastComponent 就可以。

```tsx
export const MyGlobalBroadcast = React.forwardRef<
  GlobalBroadcastRef,
  GlobalBroadcastProps
>(function (
  props: GlobalBroadcastProps,
  ref?: React.ForwardedRef<GlobalBroadcastRef>
) {
  // todo: Implement your own business logic, or modify existing business logic.
  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GlobalBroadcastTask) => {
          // todo:  Implement this interface.
        },
      };
    },
    []
  );
  return <></>;
});
```

替换默认 GlobalBroadcast 组件。

```tsx
<Chatroom GlobalBroadcast={MyGlobalBroadcast} />
```

### 自定义消息列表项样式

修改组件的消息样式。例如：

```tsx
export function MyMessageListItem(props: MessageListItemProps) {
  // todo: Implement your own business logic, or modify existing business logic.
  return <></>;
}
export const MyMessageListItemMemo = React.memo(MyMessageListItem);
```

修改后的组件添加到 Chatroom。

```tsx
<Chatroom
  messageList={{
    props: {
      MessageListItemComponent: MyMessageListItemMemo,
    },
  }}
/>
```

### 自定义聊天室成员列表项样式

修改聊天室成员组件列表样式。例如：

```tsx
export function MyParticipantListItem(props: ParticipantListItemProps) {
  // todo: Implement your own business logic, or modify existing business logic.
  return <></>;
}

export const MyParticipantListItemMemo = React.memo(MyParticipantListItem);
```

修改后的组件添加到 Chatroom。

```tsx
<Chatroom
  participantList={{
    props: {
      MemberItemComponent: MyParticipantListItemMemo,
    },
  }}
/>
```
