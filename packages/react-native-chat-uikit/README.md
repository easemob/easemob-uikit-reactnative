_English | [中文](./README.zh.md)_

# Introduction

React Native Chat UI Kit is a user interface toolkit for building instant messaging chat applications. It provides a set of pre-built components and tools that allow developers to quickly integrate chat functionality into their React Native applications. By using this UI Kit, developers can save a lot of time and effort without having to build the chat interface from scratch.

## Development Environment Requirements

- MacOS 12 or above
- React-Native 0.66 or above
- NodeJs 16.18 or above

For `iOS` applications:

- Xcode 13 or above, along with its related dependency tools.

For `Android` applications:

- Android Studio 2021 or above, along with its related dependency tools.

## Installation in the Project

```sh
npm install react-native-chat-uikit
# or
yarn add react-native-chat-uikit
```

## Dependencies

```sh
yarn add @react-native-async-storage/async-storage \
@react-native-camera-roll/camera-roll \
@react-native-clipboard/clipboard \
date-fns \
pinyin-pro \
pure-uuid \
react-native-agora \
react-native-chat-uikit \
react-native-chat-sdk \
react-native-audio-recorder-player \
@easemob/react-native-create-thumbnail \
react-native-device-info \
react-native-document-picker \
react-native-fast-image \
react-native-file-access \
react-native-gesture-handler \
react-native-get-random-values \
react-native-image-picker \
react-native-permissions \
react-native-safe-area-context \
react-native-screens \
react-native-video \
react-native-web \
react-native-webview \
twemoji
```

## Quick Start

Initialization

```typescript
import { Container } from 'react-native-chat-uikit';
function App(): React.JSX.Element {
  return (
    <Container options={{ appKey: appKey, autoLogin: false }}>
      {/** sub component */}
    </Container>
  );
}
```

Join Room

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

## Contribution

See the contributing guide to learn how to contribute to the repository and the development workflow.

## License

MIT
