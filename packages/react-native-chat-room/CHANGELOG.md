# Change Log

## 2.0.0 (2026-10-20)

### Breaking Changes

- Require `react-native-chat-sdk@^5.0.0`; Chat SDK 1.x is no longer supported. SDK types re-exported by RoomKit follow the SDK 5.x API.
- Remove the `autoLogin` initialization option. Applications must manage login restoration themselves; the existing token-based `login()` signature is unchanged.
- Make `loginState()` reflect the current RoomKit session instead of historical SDK login state. Token expiration and terminal account disconnections clear the session; ordinary network disconnections preserve it.
- Disable the default message-reporting entry. Keep the reporting UI and method, but `reportMessage()` rejects with `msg_report_error` because SDK 5.x removed the reporting API.

### SDK Adaptation

- Adapt token login, token updates, room joining, and mute events to SDK 5.x while preserving the corresponding RoomKit method and callback signatures.

### Examples

- Preserve the saved guest identity and existing AppServer token flow in `product-room-demo`. Keep `room-example` login manual.
- Return to the login screen on token expiration without automatic renewal. After expiration, the product demo requests another token only when the user starts login again.
