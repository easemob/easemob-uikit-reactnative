_English | [中文](./README.zh.md)_

# Introduction

AgoraChatCallKit is an open-source audio and video UI library developed based on Agora's real-time communications and signaling services. With this library, you can implement audio and video calling functionalities with enhanced synchronization between multiple devices. In scenarios where a user ID is logged in to multiple devices, once the user deals with an incoming call that is ringing on one device, all the other devices stop ringing simultaneously.

## Development environment requirements

- MacOS 12 or higher
- React-Native 0.66 or higher
- NodeJs 16.18 or higher

For iOS app:

- Xcode 13 or higher and its related dependency tool.

For the Android app:

- Android Studio 2021 or higher and its related dependency tool.

## Installation

```sh
npm install react-native-chat-callkit
# or
yarn add react-native-chat-callkit
```

## Dependencies

```sh
yarn add react-native-linear-gradient \
react-native-safe-area-context
```

## Quick Start

Initialization

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

Join a room

```typescript
export function ChatroomScreen() {
  return (
    <Chatroom roomId={'<room ID>'} ownerId={'<room owner ID>'}>
      {/** sub component */}
    </Chatroom>
  );
}
```

## Contributing

See the [contributing guide](../../CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
