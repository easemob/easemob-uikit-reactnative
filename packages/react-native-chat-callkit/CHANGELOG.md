# Change Log

## 1.1.0 (2026-10-20)

### SDK Compatibility

- Update the required peer dependency from `react-native-chat-sdk@^1.12.0` to `^5.0.0`. Applications using SDK 1.x must migrate the SDK before using this version.
- Preserve CallKit's own calling components, methods, and callback signatures. Re-exported SDK APIs and the `ChatMessage` type exposed by `onSignallingMessage` now follow SDK 5.x; applications using changed SDK members must adapt those usages.

### Examples

- Update `callkit-example` to use manual token login and return to the login screen on token expiration, without automatic login or token renewal.
- Reuse the unchanged AOSL version-selection script for Android builds in `callkit-example` and `product-uikit-demo`.
