_中文 | [English](./README.md)_

# 介绍

React Native Chat UI Kit 是一个用于构建即时通讯聊天应用的用户界面工具包。它提供了一组预构建的组件和工具，使开发者能够快速集成聊天功能到他们的 React Native 应用中。通过使用这个 UI Kit，开发者可以节省大量的时间和精力，而无需从头开始构建聊天界面。

## 开发环境要求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本

对于 `iOS` 应用：

- Xcode 15 或以上版本，以及它的相关依赖工具。

对于 `Android` 应用：

- Android Studio 2022 或以上版本，以及它的相关依赖工具。

## 安装到项目中

```sh
npm install react-native-chat-uikit
# or
yarn add react-native-chat-uikit
```

## 依赖项

```sh
yarn add @react-native-async-storage/async-storage \
@react-native-camera-roll/camera-roll \
@react-native-clipboard/clipboard \
react-native-audio-recorder-player \
react-native-chat-sdk \
react-native-create-thumbnail \
react-native-device-info \
@react-native-documents/picker \
react-native-fast-image \
react-native-file-access \
react-native-gesture-handler \
react-native-image-picker \
react-native-safe-area-context \
react-native-video
```

## 快速开始

初始化

```typescript
import { Container } from 'react-native-chat-uikit';
function App(): React.JSX.Element {
  return (
    <Container options={{ appKey: '<your app key>' }}>
      {/** sub component */}
    </Container>
  );
}
```

进入聊天页面

```typescript
export function ConversationDetailScreen() {
  return (
    <ConversationDetail
      convId={'<conversation ID>'}
      convType={'<conversation type by number>'}
      type={'chat'}
    />
  );
}
```

## 贡献

See the [contributing guide](../../CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 许可证

MIT
