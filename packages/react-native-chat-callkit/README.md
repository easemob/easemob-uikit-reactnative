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
yarn add react-native-agora \
react-native-device-info \
react-native-fast-image \
react-native-pager-view \
react-native-chat-sdk \
react-native-paper \
react-native-permissions \
react-native-safe-area-context \
react-native-tab-view \
react-native-screens
```

## Quick Start

Initialization

```typescript
import { GlobalContainer } from 'react-native-chat-callkit';
export function App() {
  return (
    <GlobalContainer opt={{ appKey: '<your app key>' }}>
      {/** sub component */}
    </GlobalContainer>
  );
}
```

Join a audio or video chat.


## Contributing

See the [contributing guide](../../CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
