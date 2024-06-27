[返回父文档](./index.en.md)

- [callkit-example Overview](#callkit-example-overview)
  - [Project Configuration](#project-configuration)
  - [Project Compilation](#project-compilation)
  - [Rest Services](#rest-services)
  - [Initialization Overview](#initialization-overview)
  - [Page Overview](#page-overview)
  - [Signaling Overview](#signaling-overview)
  - [Listener Overview](#listener-overview)
  - [FAQs](#faqs)

# callkit-example Overview

This component library is primarily used to implement audio and video call functions. It mainly uses message sending and receiving provided by `chat` to handle signaling, and `react-native` to implement UI components.

This component library mainly supports audio and video calls in both single and group chats.

The library primarily depends on `react-native-chat-sdk` and `react-native-agora` to implement audio and video calls.

## Project Configuration

Refer to the `existed-app` section.
Additionally, note that this project is a local dependency, meaning it will automatically use the local npm packages provided in the repository. There's no need for explicit specification.

## Project Compilation

The project is a subdirectory of the repository. You need to initialize the repository before building the project.

```sh
# In the root directory
yarn
# Initialize the configuration, generate version.ts, env.ts, config.local.ts, etc., and fill in the necessary parameters
yarn yarn-prepack
# Switch to the subdirectory
cd examples/callkit-example
# If it's for the iOS platform, run
cd ios && pod install
# If it's for the Android platform, run the Android project's sync
```

## Rest Services

To run this example project, you need to configure `AppServer`. Deploy the `AppServer` service on the server side and implement the `RestApi` interface on the client side. (See `AppServerClient` for details)
In this example project, configure the server address with `RestApi.setServer`, and provide interfaces for obtaining phone verification codes, phone login, uploading avatars, obtaining `rtcToken`, obtaining `rtcMap`, and getting the group owner's avatar.

See `examples/callkit-example/src/utils/AppServer.ts` [source code](../../../examples/callkit-example/src/utils/AppServer.ts) for details.

## Initialization Overview

The project's configuration is very important and is usually completed at the early stage of the program.

For example:

```tsx
import { GlobalContainer as CallKitContainer } from 'react-native-chat-callkit';
export function App() {
  // ...
  return (
    <CallKitContainer
      option={{
        appKey: gAppKey,
        agoraAppId: agoraAppId,
      }}
      type={accountType as any}
      requestRTCToken={requestRTCToken}
      requestUserMap={requestUserMap}
      requestCurrentUser={requestCurrentUser}
      requestUserInfo={requestUserInfo}
      requestInviteContent={requestInviteContent}
    >
      {/* More pages */}
    </CallKitContainer>
  );
}
```

See `example/src/demo/App.tsx` for detailed usage.

## Page Overview

The pages are mainly divided into single chat audio and video pages and group chat audio and video pages.

- SingleCall: `packages/react-native-chat-callkit/src/view/SingleCall.tsx` [source code](../../../packages/react-native-chat-callkit/src/view/SingleCall.tsx)
- MultiCall: `packages/react-native-chat-callkit/src/view/MultiCall.tsx` [source code](../../../packages/react-native-chat-callkit/src/view/MultiCall.tsx)

See `examples/callkit-example/src/screens/Home.tsx` [source code](../../../examples/callkit-example/src/screens/Home.tsx) for details.

## Signaling Overview

The control of single and group chat audio and video streams requires signaling (commands that manage and control multi-party audio and video collaboration). It is mainly completed through `CallManager`. Currently, there is no method provided for using signaling alone without using the pages, but updates will be provided later. The signaling manager mainly completes audio and video calls through indirect page calls.

## Listener Overview

The `CallListener` listener object is mainly used to receive audio and video call invitations sent by other devices, as well as error notifications. It needs to be set during the initialization phase.

See `examples/callkit-example/src/screens/Home.tsx` [source code](../../../examples/callkit-example/src/screens/Home.tsx) for details.

## FAQs

1. How many audio and video streams are currently supported?
   Reference description: Audio 128 streams, video 16 streams.
