# react-native-chat-callkit

callkit

## Installation

```sh
npm install react-native-chat-callkit
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

The Agora RTC engine used by this package comes from `react-native-agora`, which currently integrates through CocoaPods only (`AgoraRtcEngine_Special_iOS` / `AgoraIrisRTC_iOS`). In SPM mode the IM SDK is integrated via SPM while the Agora engine remains on CocoaPods. Note that the Agora pods bundle their own `aosl.xcframework`; in SPM mode `aosl` already comes from the `ShengwangInfra_iOS` SPM package, so the Pod-bundled copies must be removed (otherwise the build fails with `Multiple commands produce .../aosl.framework`). The `fix_aosl_conflicting.rb` helper used by the `callkit-example` / `product-uikit-demo` apps (`scripts/patch-ios-build.js`) handles this automatically in a `pre_install` hook.

Note: CocoaPods trunk becomes read-only on 2026-12-02. Already-published pod versions (including the Agora pods above) remain installable, but new versions can no longer be fetched from trunk.

## Usage

```js
import { ChatCallkitView } from 'react-native-chat-callkit';

// ...

<ChatCallkitView color="tomato" />;
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
