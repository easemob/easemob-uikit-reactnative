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

### iOS Integration: CocoaPods and Swift Package Manager

This package's own iOS native code has no third-party CocoaPods dependencies, so the default `pod install` flow works unchanged. The native IM SDK (`HyphenateChat`) is provided by `react-native-chat-sdk`, whose podspec selects the integration mode automatically:

| Condition | Integration |
| --- | --- |
| React Native >= 0.75 and `USE_FRAMEWORKS=dynamic pod install` | Swift Package Manager |
| Otherwise (default `pod install`, static linkage) | CocoaPods (`HyphenateChat` pod) |

With the SPM mode, the `HyphenateChat` package (<https://github.com/easemob/HyphenateChat_iOS.git>) is added to the Xcode project via `spm_dependency`; reopen the `.xcworkspace` after `pod install` so Xcode refreshes the package state.

**Required for SPM mode — otherwise the app crashes at launch** with `Library not loaded: @rpath/HyphenateChat.framework/HyphenateChat`. `spm_dependency` attaches the SPM package to the ChatSdk *pod* target, but Xcode only embeds SPM products attached to the *app* target, so `HyphenateChat.framework` (and `aosl.framework`) never lands in the app bundle. Copy `docs/troubleshooting/embed_spm_frameworks.rb` from this repository into your `ios/` directory (next to the Podfile) and wire it into the Podfile:

```ruby
require_relative 'embed_spm_frameworks'

post_install do |installer|
  SpmEmbed.embed_spm_products(installer)
  # ... your existing post_install code (e.g. react_native_post_install)
end
```

It is a no-op unless `USE_FRAMEWORKS=dynamic`, so CocoaPods-mode installs are unaffected. See `docs/troubleshooting/ios-spm-support.md` for details.

Note: CocoaPods trunk becomes read-only on 2026-12-02. Already-published pod versions remain installable, but new versions can no longer be fetched from trunk.

#### Third-party patches in SPM mode

Some older third-party libraries still declare `s.dependency "React-Core"` in their podspecs, which fails to link under `use_frameworks! :linkage => :dynamic` (required by SPM mode). **Static CocoaPods mode is unaffected — no action needed.**

If your app uses any of the libraries below in SPM mode, apply the ready-made patches shipped in this repository under `docs/troubleshooting/patches/` (usage: yarn `patch:` protocol or patch-package; see `docs/troubleshooting/ios-spm-support.md`):

| Library | Versions known to need the patch |
| --- | --- |
| `react-native-device-info` | <= 15.0.2 |
| `@react-native-camera-roll/camera-roll` | <= 7.10.2 |
| `react-native-audio-recorder-player` | 3.6.x |
| `react-native-create-thumbnail` | <= 2.2.0 |
| `react-native-file-viewer` | <= 2.1.5 |
| `react-native-fs` | <= 2.20.0 |

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
function App(): React.React.ReactElement {
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
