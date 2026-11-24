# Change Log

## 1.2.0 (2026-11-24)

### iOS SPM Support

- Document integration under `use_frameworks! :linkage => :dynamic` (SPM mode) in the README, including the required app-target SPM embedding step and the AOSL deduplication needed when `AgoraRtcEngine_Special_iOS` is used alongside the SPM-delivered `aosl`. Static CocoaPods integration is unchanged and requires no action.

### Examples

- Support SPM mode in `callkit-example` via `scripts/patch-ios-build.js`; verified to build in SPM mode.

## 1.1.0 (2026-10-20)

### SDK Compatibility

- Update the required peer dependency from `react-native-chat-sdk@^1.12.0` to `^5.0.0`. Applications using SDK 1.x must migrate the SDK before using this version.
- Preserve CallKit's own calling components, methods, and callback signatures. Re-exported SDK APIs and the `ChatMessage` type exposed by `onSignallingMessage` now follow SDK 5.x; applications using changed SDK members must adapt those usages.

### Examples

- Update `callkit-example` to use manual token login and return to the login screen on token expiration, without automatic login or token renewal.
- Reuse the unchanged AOSL version-selection script for Android builds in `callkit-example` and `product-uikit-demo`.
