[返回父文档](./index.md)

- [CallKit 介绍](#callkit-介绍)
  - [功能简介](#功能简介)
  - [环境要求](#环境要求)
  - [安装](#安装)
    - [依赖项](#依赖项)
  - [初始化](#初始化)
    - [GlobalContainer 属性](#globalcontainer-属性)
    - [初始化示例](#初始化示例)
  - [核心组件](#核心组件)
    - [SingleCall 单人通话](#singlecall-单人通话)
    - [MultiCall 多人通话](#multicall-多人通话)
  - [信令管理](#信令管理)
  - [事件监听](#事件监听)
  - [工具方法](#工具方法)

# CallKit 介绍

## 功能简介

CallKit 是一个基于声网 Agora RTC 的音视频通话 UIKit，支持：

- 单人音视频通话（1v1）
- 多人音视频通话（最多 18 路视频或 128 路音频）
- 完整的通话 UI 组件
- 通话信令管理
- 自定义通话界面和邀请列表

## 环境要求

- React Native 0.71 或以上版本
- iOS: Xcode 15 或以上版本
- Android: Android Studio 2022 或以上版本

## 安装

```sh
npm install react-native-chat-callkit
# or
yarn add react-native-chat-callkit
```

### 依赖项

```sh
yarn add @react-native-community/blur \
  react-native-agora \
  react-native-chat-sdk \
  react-native-safe-area-context \
  react-native-screens
```

## 初始化

使用 `GlobalContainer` 组件初始化 CallKit，必须在应用的最外层包裹该组件。

### GlobalContainer 属性

| 属性                   | 类型                   | 必填 | 说明                           |
| ---------------------- | ---------------------- | ---- | ------------------------------ |
| `option`               | `CallOption`           | 是   | 通话配置选项                   |
| `requestRTCToken`      | `Function`             | 是   | 获取 RTC token 的回调          |
| `requestUserMap`       | `Function`             | 是   | 获取用户 ID 映射关系的回调     |
| `requestCurrentUser`   | `Function`             | 是   | 获取当前用户信息的回调         |
| `requestUserInfo`      | `Function`             | 否   | 获取用户信息的回调（可选）     |
| `requestInviteContent` | `Function`             | 否   | 自定义邀请内容的回调           |
| `enableLog`            | `boolean`              | 否   | 是否启用日志                   |
| `type`                 | `'easemob' \| 'agora'` | 否   | RTC token 类型，默认为 `agora` |
| `logHandler`           | `Function`             | 否   | 日志处理回调                   |

**CallOption 配置：**

```typescript
interface CallOption {
  appKey: string; // 环信 AppKey（必填）
  agoraAppId: string; // 声网 AppId（必填）
  callTimeout?: number; // 通话超时时间（秒），默认 30 秒
  ringFilePath?: string; // 本地铃声文件路径
}
```

### 初始化示例

```tsx
import { GlobalContainer } from 'react-native-chat-callkit';

function App() {
  return (
    <GlobalContainer
      option={{
        appKey: 'your-app-key',
        agoraAppId: 'your-agora-app-id',
        callTimeout: 30,
      }}
      requestRTCToken={({
        channelId,
        userId,
        userChannelId,
        type,
        onResult,
      }) => {
        // 从服务器获取 RTC token
        fetch('your-server/rtc-token', {
          method: 'POST',
          body: JSON.stringify({ channelId, userId, userChannelId }),
        })
          .then((res) => res.json())
          .then((data) => onResult({ data: data.token }))
          .catch((error) => onResult({ error }));
      }}
      requestUserMap={({ channelId, userId, onResult }) => {
        // 获取用户映射关系
        fetch('your-server/user-map', {
          method: 'POST',
          body: JSON.stringify({ channelId, userId }),
        })
          .then((res) => res.json())
          .then((data) => onResult({ data }))
          .catch((error) => onResult({ error }));
      }}
      requestCurrentUser={({ onResult }) => {
        // 返回当前用户信息
        onResult({
          user: {
            userId: 'current-user-id',
            userName: '当前用户',
            userAvatarUrl: 'avatar-url',
          },
        });
      }}
      requestUserInfo={({ userId, onResult }) => {
        // 获取指定用户信息（可选）
        onResult({
          user: {
            userId,
            userName: '用户名称',
            userAvatarUrl: 'avatar-url',
          },
        });
      }}
      enableLog={true}
    >
      {/* 你的应用组件 */}
    </GlobalContainer>
  );
}
```

## 核心组件

### SingleCall 单人通话

用于 1v1 音视频通话的 UI 组件。

**属性：**

| 属性            | 类型                 | 必填 | 说明               |
| --------------- | -------------------- | ---- | ------------------ |
| `inviteeId`     | `string`             | 是   | 被邀请人的用户 ID  |
| `inviteeName`   | `string`             | 否   | 被邀请人的昵称     |
| `inviteeAvatar` | `string`             | 否   | 被邀请人的头像 URL |
| `callType`      | `'audio' \| 'video'` | 是   | 通话类型           |
| `callState`     | `CallState`          | 否   | 通话状态           |
| `isInviter`     | `boolean`            | 是   | 是否为发起者       |
| `currentId`     | `string`             | 是   | 当前用户 ID        |
| `currentName`   | `string`             | 否   | 当前用户昵称       |
| `currentAvatar` | `string`             | 否   | 当前用户头像 URL   |
| `isMinimize`    | `boolean`            | 否   | 是否最小化显示     |
| `onHangUp`      | `Function`           | 否   | 挂断回调           |
| `onCancel`      | `Function`           | 否   | 取消回调           |
| `onRefuse`      | `Function`           | 否   | 拒绝回调           |
| `onError`       | `Function`           | 否   | 错误回调           |
| `onPeerJoined`  | `Function`           | 否   | 对方加入通话的回调 |

**示例：**

```tsx
import { SingleCall, CallState } from 'react-native-chat-callkit';

function MyCallScreen() {
  return (
    <SingleCall
      inviteeId="peer-user-id"
      inviteeName="张三"
      inviteeAvatar="https://example.com/avatar.jpg"
      callType="video"
      isInviter={true}
      currentId="my-user-id"
      currentName="我"
      onHangUp={(elapsed) => {
        console.log('通话结束，时长：', elapsed);
      }}
      onError={(error) => {
        console.error('通话错误：', error);
      }}
    />
  );
}
```

### MultiCall 多人通话

用于多人音视频通话的 UI 组件。

**属性：**

| 属性          | 类型                 | 必填 | 说明                   |
| ------------- | -------------------- | ---- | ---------------------- |
| `inviteeIds`  | `string[]`           | 是   | 被邀请人的用户 ID 列表 |
| `invitees`    | `CallUser[]`         | 否   | 被邀请人信息列表       |
| `groupId`     | `string`             | 否   | 群组 ID                |
| `groupName`   | `string`             | 否   | 群组名称               |
| `groupAvatar` | `string`             | 否   | 群组头像 URL           |
| `callType`    | `'audio' \| 'video'` | 是   | 通话类型               |
| `isInviter`   | `boolean`            | 是   | 是否为发起者           |
| `currentId`   | `string`             | 是   | 当前用户 ID            |
| `inviteeList` | `Object`             | 否   | 自定义邀请列表组件     |

**邀请列表组件属性：**

```typescript
interface InviteeListProps {
  selectedIds: string[]; // 已选中的用户 ID
  maxCount: number; // 最大邀请数量（视频 18，音频 128）
  onClose: (addedIds: string[], addeds?: CallUser[]) => void; // 关闭回调
  onCancel: () => void; // 取消回调
}
```

**示例：**

```tsx
import { MultiCall } from 'react-native-chat-callkit';

function MyMultiCallScreen() {
  return (
    <MultiCall
      inviteeIds={['user1', 'user2', 'user3']}
      invitees={[
        { userId: 'user1', userName: '用户1', userAvatarUrl: 'url1' },
        { userId: 'user2', userName: '用户2', userAvatarUrl: 'url2' },
        { userId: 'user3', userName: '用户3', userAvatarUrl: 'url3' },
      ]}
      callType="video"
      isInviter={true}
      currentId="my-user-id"
      groupId="group-id"
      groupName="群聊名称"
      onHangUp={(elapsed) => {
        console.log('通话结束');
      }}
    />
  );
}
```

## 信令管理

CallKit 提供了 `CallManager` 用于管理通话信令，信令基于环信 IM 实现。

**获取管理器：**

```typescript
import { createManager } from 'react-native-chat-callkit';

const callManager = createManager();
```

**主要方法：**

- `addListener(listener: CallListener)`: 添加通话事件监听器
- `removeListener(listener: CallListener)`: 移除事件监听器
- `setLogHandler(handler)`: 设置日志处理器

## 事件监听

通过 `CallListener` 接口监听通话事件：

```typescript
import { CallListener, CallType } from 'react-native-chat-callkit';

const listener: CallListener = {
  // 收到通话邀请
  onCallReceived: ({ channelId, inviterId, callType, extension }) => {
    console.log('收到通话邀请：', inviterId);
    // 显示通话界面
  },

  // 通话错误
  onCallOccurError: ({ channelId, error }) => {
    console.error('通话错误：', error);
  },

  // 信令消息
  onSignallingMessage: (msg) => {
    console.log('信令消息：', msg);
  },
};

callManager.addListener(listener);
```

## 工具方法

**枚举类型：**

```typescript
// 通话类型
enum CallType {
  Audio1v1 = 0, // 单人音频
  Video1v1 = 1, // 单人视频
  VideoMulti = 2, // 多人视频
  AudioMulti = 3, // 多人音频
}

// 通话状态
enum CallState {
  Idle = 0, // 空闲
  Connecting = 1, // 连接中
  Calling = 2, // 通话中
}

// 结束原因
enum CallEndReason {
  HungUp = 0, // 挂断
  Cancel = 1, // 取消
  RemoteCancel = 2, // 对方取消
  RemoteRefuse = 3, // 对方拒绝
  RemoteBusy = 4, // 对方忙
  NoResponse = 5, // 无响应
  RemoteNoResponse = 6, // 对方无响应
  HandleOnOtherDevice = 7, // 其他设备处理
}
```

**工具函数：**

```typescript
import {
  formatElapsed,
  timestamp,
  CALLKIT_VERSION,
} from 'react-native-chat-callkit';

// 格式化通话时长（秒 -> HH:MM:SS）
const timeStr = formatElapsed(3661); // "01:01:01"

// 获取当前时间戳
const now = timestamp();

// 获取 CallKit 版本
console.log(CALLKIT_VERSION);
```
