_中文 | [English](./README.md)_

# 介绍

本产品主要为了解决大部分用户的泛娱乐业务场景下对聊天室的绝大部分用户需求，主要为用户解决直接集成 SDK 繁琐，复杂度高，部分 api 体验不好（在用户侧开发者来看）等问题。致力于打造集成简单，自由度高，流程简单，文档说明足够详细的聊天室 UIKit 产品。

## 开发环境要求

- MacOS 12 或以上版本
- React-Native 0.66 或以上版本
- NodeJs 16.18 或以上版本

对于 `iOS` 应用：

- Xcode 13 或以上版本，以及它的相关依赖工具。

对于 `Android` 应用：

- Android Studio 2021 或以上版本，以及它的相关依赖工具。

## 安装到项目中

```sh
npm install react-native-chat-room
# or
yarn add react-native-chat-room
```

## 依赖项

```sh
yarn add react-native-linear-gradient \
react-native-safe-area-context
```

## 快速开始

初始化

```typescript
import { Container } from 'react-native-chat-room';
export function App() {
  return (
    <Container opt={{ appKey: '<your app key>' }}>
      {/** sub component */}
    </Container>
  );
}
```

加入房间

```typescript
export function ChatroomScreen() {
  return (
    <Chatroom roomId={'<room ID>'} ownerId={'<room owner ID>'}>
      {/** sub component */}
    </Chatroom>
  );
}
```

## 贡献

See the [contributing guide](../../CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 许可证

MIT
