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

## 项目初始化

1. 使用 `vscode` 打开项目 `react-native-chat-library`
2. 使用 `terminal` 初始化项目 `yarn`
3. 如果是第一次项目初始化，还需要执行命令 `cd examples/callkit-example && yarn run gse`，生成相应的文件。例如：`env.ts`。

**注意** `yarn` 会执行额外的命令，对于不了解命令的开发者，如果需要使用 `npm` 命令替换，需要了解更加相信的内容。
**注意** 在创建该项目的时候，脚手架已经预置了部分 `yarn` 相关的命令，所以，推荐使用 `yarn` 完成绝大部分工作。
**注意** 由于 `example` 使用了 `firebase cloud message (fcm)` 相关内容，如果用户需要使用相关内容，需要设置对应的文件（ios 平台需要 GoogleService-Info.plist， android 平台需要 google-services.json），如果不需要则删除相关内容即可。

## 使用 visual studio code 编译运行

编译 ios 平台： `yarn run ios`
编译 android 平台：`yarn run android`

**注意** 不推荐原因包括：原生编译运行问题可能无法发现，找不到模拟器或者真机，需要额外设置。
**注意** 可以通过 `yarn run start` 启动调试服务（推荐）

## 使用 xcode 编译运行

需要运行 pod 相应命令。

```sh
cd examples/callkit-example/ios
pod install
```

使用 xcode 打开工程 `examples/callkit-example/ios/example.xcworkspace` 编译和运行应用。

## 使用 android studio 编译运行

使用 android studio 打开项目 `examples/callkit-example/android` 编译运行应用。
**注意** 默认会进行 `sync gradle`，否则需要手动操作。

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

## 现有项目集成

callkit sdk 提供了单人音视频和多人音视频的信令以及页面。

### 安装 `callkit` 到现有项目中

```sh
cd your_project_root
yarn add react-native-chat-callkit
```

### 初始化设置

```typescript
import './utils/globals';

import * as React from 'react';
import {
  CallUser,
  GlobalContainer as CallkitContainer,
} from 'react-native-chat-callkit';

let appKey = '';
let agoraAppId = '';

export default function App() {
  const enableLog = true;

  return (
    <CallkitContainer
      option={{
        appKey: appKey,
        agoraAppId: agoraAppId,
      }}
      enableLog={enableLog}
      requestRTCToken={(params: {
        appKey: string;
        channelId: string;
        userId: string;
        onResult: (params: { data?: any; error?: any }) => void;
      }) => {
        // TODO: get rtc token.
      }}
      requestUserMap={(params: {
        appKey: string;
        channelId: string;
        userId: string;
        onResult: (params: { data?: any; error?: any }) => void;
      }) => {
        // TODO: get user map.
      }}
      requestCurrentUser={(params: {
        onResult: (params: { user: CallUser; error?: any }) => void;
      }) => {
        // TODO: get current user information.
      }}
    />
  );
}
```

**注意** 实际开发中需要使用 chat sdk 以及相关技术。
**注意** 实际开发需要注意页面的层次关系，正确加载和卸载音视频页面。[参考](./src/App.tsx)

### 监听器设置

通过添加监听器可以收到邀请通知和异常通知。

```typescript
import * as React from 'react';
import { View } from 'react-native';
import {
  CallError,
  CallListener,
  CallType,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';

export default function HomeScreen(): JSX.Element {
  const { call } = useCallkitSdkContext();

  const addListener = React.useCallback(() => {
    const listener = {
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        // TODO: show call view.
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        // TODO: handle error.
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);

  return <View />;
}
```

### 页面主要介绍

单人音视频页面 `SingleCall` 和 多人音视频页面 `MultiCall`。

基本通用属性。其中重要的必填的属性主要包括：

- appKey：应用 chat id
- agoraAppId： 应用 rtc id
- inviterId： 邀请者 id
- currentId：当前用户 id
- callType：音频还是视频聊天
- isInviter：当前用户是否是邀请者
- onClose：关闭页面请求，需要用户关闭并销毁页面。

```typescript
export type BasicCallProps = {
  inviterId: string;
  inviterName: string;
  inviterAvatar?: string;
  currentId: string;
  currentName: string;
  currentAvatar?: string;
  timeout?: number;
  bottomButtonType?: BottomButtonType;
  muteVideo?: boolean;
  callType: 'audio' | 'video';
  isInviter: boolean;
  callState?: CallState;
  isMinimize?: boolean;
  isTest?: boolean;
  onHangUp?: () => void;
  onCancel?: () => void;
  onRefuse?: () => void;
  onClose: (elapsed: number, reason?: CallEndReason) => void;
  onError?: (error: CallError) => void;
  onInitialized?: () => void;
  onSelfJoined?: () => void;
};
```

单人属性。

```typescript
export type SingleCallProps = BasicCallProps & {
  inviteeId: string;
  onPeerJoined?: () => void;
};
```

多人属性。

```typescript
export type MultiCallProps = BasicCallProps & {
  inviteeIds: string[];
  inviteeList?: {
    InviteeList: (props: InviteeListProps) => JSX.Element;
    props?: InviteeListProps;
  };
};
```

### 邀请单人音视频

主动发起邀请，显示单人音视频页面。
在示例代码中，主要是通过发送事件来显示页面。

```typescript
// send show call command.
sendHomeEvent();
// show call view.
VoiceStateContextType.showState();
```

### 邀请多人音视频

主动发起邀请，显示多人音视频页面。
发送多人和单人不同的是邀请人多个。示例代码请参考单人部分。

### 收到邀请通知

在收到邀请通知后，显示音视频通话页面。

### 示例代码

[发送命令参考](./src/screens/Home.tsx)
[页面显示参考](./src/events/VoiceStateEvent.tsx)
