[Return to Parent Document](./index.en.md)

- [CallKit](#callkit)
  - [Initialization](#initialization)
  - [Signaling](#signaling)
  - [UI](#ui)

# CallKit

Supports one-on-one and group audio/video calls.

## Initialization

The `appKey` parameter must be provided during initialization. Other registered callback parameters are also crucial and require interaction with the audio/video library. Refer to the `GlobalContainerProps` attribute description for more details.

See `example/src/demo/App.tsx` Sample [source code](../../../example/src/demo/App.tsx)。

## Signaling

Signaling consists of control commands for audio/video in one-on-one and group conversations. It needs to be implemented through the send/receive message mechanism provided by `chat`. Currently, it is not exposed independently and must be used in conjunction with UI components. Consideration will be given to exposing it separately in the future to enhance the flexibility of custom UI components.

## UI

The UI components mainly offer one-on-one and group chat interfaces, supporting audio and video calls.

See `example/src/demo/common/AVView.tsx` Example [source code](../../../example/src/demo/common/AVView.tsx).
