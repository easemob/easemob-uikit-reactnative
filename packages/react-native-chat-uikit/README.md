_English | [中文](./README.zh.md)_

# Introduction

React Native Chat UI Kit is a user interface toolkit for building instant messaging chat applications. It provides a set of pre-built components and tools that allow developers to quickly integrate chat functionality into their React Native applications. By using this UI Kit, developers can save a lot of time and effort without having to build the chat interface from scratch.

## Development Environment Requirements

- MacOS 12 or higher
- React-Native 0.71 or higher
- NodeJs 20.18 or higher

For `iOS` applications:

- Xcode 15 or above, along with its related dependency tools.

For `Android` applications:

- Android Studio 2022 or above, along with its related dependency tools.

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
react-native-audio-recorder-player \
react-native-chat-sdk \
react-native-create-thumbnail \
react-native-device-info \
@react-native-documents/picker \
react-native-file-access \
react-native-gesture-handler \
react-native-image-picker \
react-native-safe-area-context \
react-native-video
```

## Quick Start

Initialization

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

Enter chat page.

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
