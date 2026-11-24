# react-native-chat-room

room

## Installation

```sh
npm install react-native-chat-room
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

This package requires `react-native-linear-gradient` >= 3.0.0-beta.0, which already builds cleanly in SPM mode. If your app pins `react-native-linear-gradient` 2.x, its podspec fails under `use_frameworks! :linkage => :dynamic`; either upgrade to >= 3.0.0-beta.0 or apply a podspec patch (change `s.dependency "React-Core"` to `install_modules_dependencies(s)`). **Static CocoaPods mode is unaffected — no action needed.** See `docs/troubleshooting/ios-spm-support.md` in this repository for details and ready-made patches for other common libraries.

## Usage

```js
import { ChatRoomView } from 'react-native-chat-room';

// ...

<ChatRoomView color="tomato" />;
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
