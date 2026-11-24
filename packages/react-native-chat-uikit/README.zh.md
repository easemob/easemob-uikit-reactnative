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

### iOS 集成方式：CocoaPods 与 Swift Package Manager

本包自身的 iOS 原生代码没有第三方 CocoaPods 依赖，默认 `pod install` 流程无需改动。原生 IM SDK（`HyphenateChat`）由 `react-native-chat-sdk` 提供，其 podspec 会自动选择集成方式：

| 条件 | 集成方式 |
| --- | --- |
| React Native >= 0.75 且 `USE_FRAMEWORKS=dynamic pod install` | Swift Package Manager |
| 其他情况（默认 `pod install`、静态链接） | CocoaPods（`HyphenateChat` pod） |

SPM 模式下，`HyphenateChat` 包（<https://github.com/easemob/HyphenateChat_iOS.git>）会通过 `spm_dependency` 加入 Xcode 工程；`pod install` 后请重新打开 `.xcworkspace`，让 Xcode 刷新包状态。

**SPM 模式必做——否则 App 启动即崩溃**，报错 `Library not loaded: @rpath/HyphenateChat.framework/HyphenateChat`。`spm_dependency` 只把 SPM 包挂到 ChatSdk 这个 *pod target* 上，而 Xcode 只嵌入挂到 *App target* 的 SPM product，导致 `HyphenateChat.framework`（以及 `aosl.framework`）没有被打进 App 包。请把本仓库 `docs/troubleshooting/embed_spm_frameworks.rb` 复制到你的 `ios/` 目录（与 Podfile 同级），并在 Podfile 中接入：

```ruby
require_relative 'embed_spm_frameworks'

post_install do |installer|
  SpmEmbed.embed_spm_products(installer)
  # ... 你已有的 post_install 代码（如 react_native_post_install）
end
```

该脚本仅在 `USE_FRAMEWORKS=dynamic` 时生效，CocoaPods 模式为 no-op。详见 `docs/troubleshooting/ios-spm-support.md`。

注意：CocoaPods trunk 将于 2026-12-02 进入只读状态，已发布的版本仍可安装，但无法再从 trunk 获取新版本。

#### SPM 模式下的三方库补丁

一些较老的三方库 podspec 仍使用 `s.dependency "React-Core"` 写法，在 `use_frameworks! :linkage => :dynamic`（SPM 模式必需）下会链接失败。**静态 CocoaPods 模式不受影响，无需任何处理。**

如果你的 App 在 SPM 模式下使用了下列库，请应用本仓库 `docs/troubleshooting/patches/` 目录中现成的补丁（用法：yarn `patch:` 协议或 patch-package，详见 `docs/troubleshooting/ios-spm-support.md`）：

| 库 | 已知需要补丁的版本 |
| --- | --- |
| `react-native-device-info` | <= 15.0.2 |
| `@react-native-camera-roll/camera-roll` | <= 7.10.2 |
| `react-native-audio-recorder-player` | 3.6.x |
| `react-native-create-thumbnail` | <= 2.2.0 |
| `react-native-file-viewer` | <= 2.1.5 |
| `react-native-fs` | <= 2.20.0 |

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
function App(): React.React.ReactElement {
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
