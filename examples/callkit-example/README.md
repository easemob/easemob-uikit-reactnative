_English | [中文](./README.zh.md)_

---

# quick start

Take you to quickly complete the compilation and operation of the project.

## Environment preparation

- operating system:
  - MacOS 10.15.7 or above
- Tools collection:
  - Xcode 13.4 or above (if developing iOS platform reference)
  - Android studio 2021.3.1 or above (if developing Android platform applications) (as for short)
  - Visual Studio Code latest (vscode for short)
- Compile and run environment:
  - Java JDK 1.8.0 or above (it is recommended to use Android studio's own)
  - Objective-C 2.0 or above (recommended to use Xcode comes with it)
  - Typescript 4.0 or above
  - Nodejs 16.18.0 or above (brew installation is recommended)
  - yarn 1.22.19 or above (brew installation is recommended)
  - React-Native 0.63.5 and above
  - npm and related tools (**not recommended**, please solve related problems by yourself)
  - expo 6.0.0 or above

## Source code download

[Download URL](https://github.com/AgoraIO-Usecase/AgoraChat-rn)

```sh
git clone git@github.com:AgoraIO-Usecase/AgoraChat-rn.git
```

## Project initialization

1. Use `vscode` to open the project `react-native-chat-library`
2. Use `terminal` to initialize the project `yarn`
3. If it is the first project initialization, you also need to execute the command `cd examples/callkit-example && yarn run gse` to generate the corresponding files. For example: `env.ts`.

**Note** `yarn` will execute additional commands. For developers who do not understand commands, if they need to use `npm` command replacement, they need to understand more reliable content.
**Note** When creating this project, the scaffolding has preset some commands related to `yarn`, so it is recommended to use `yarn` to complete most of the work.
**Note** Because `example` uses `firebase cloud message (fcm)` related content, if users need to use related content, they need to set the corresponding file (GoogleService-Info.plist is required for ios platform, google-services is required for android platform .json), if you don’t need it, just delete the relevant content.

## Compile and run with visual studio code

Compile for ios platform: `yarn run ios`
Compile the android platform: `yarn run android`

**Note** Reasons for not recommending include: native compilation and running problems may not be found, emulators or real devices cannot be found, and additional settings are required.
**NOTE** The debug service can be started via `yarn run start` (recommended)

## Compile and run with xcode

Need to run pod corresponding command.

```sh
cd examples/callkit-example/ios
pod install
```

Use xcode to open the project `examples/callkit-example/ios/example.xcworkspace` to compile and run the application.

## Compile and run with android studio

Use android studio to open the project `examples/callkit-example/android` to compile and run the application.
**Note** `sync gradle` will be performed by default, otherwise manual operation is required.

## parameter settings

After project initialization, a local configuration file of `env.ts` will be generated in the `example` project.

```typescript
export const test = false; // test mode or no
export const appKey = ''; // from register console
export const id = ''; // default user id
export const ps = ''; // default password or token
export const accountType = 'agora'; // 'easemob' or 'agora'
```

- `test`: When it is `true`, the page will switch to the simple component test mode, and the demonstration of the local component can be completed without performing remote operations such as login and logout. Defaults to `false`
- `appKey`: The unique identifier of the application, usually obtained through the background of the website
- `id`: The id of the logged-in user, usually obtained through registration or the background of the website
- `ps`: The secret key of the logged-in user, usually obtained through registration or the background of the website
- `accountType`: You can switch between domestic and foreign logins, the default is `agora`

## Existing project integration

callkit sdk provides signaling and pages for single-person audio and video and multi-person audio and video.

### Install `callkit` into an existing project

```sh
cd your_project_root
yarn add react-native-chat-callkit
```

### Initialization settings

```typescript
import './utils/globals';

import * as React from 'react';
import {
  CallUser,
  GlobalContainer as CallkitContainer,
} from 'react-native-chat-callkit';

let appKey = '';
let agoraAppId = '';

export default function App() {
  const enableLog = true;

  return (
    <CallkitContainer
      option={{
        appKey: appKey,
        agoraAppId: agoraAppId,
      }}
      enableLog={enableLog}
      requestRTCToken={(params: {
        appKey: string;
        channelId: string;
        userId: string;
        onResult: (params: { data?: any; error?: any }) => void;
      }) => {
        // TODO: get rtc token.
      }}
      requestUserMap={(params: {
        appKey: string;
        channelId: string;
        userId: string;
        onResult: (params: { data?: any; error?: any }) => void;
      }) => {
        // TODO: get user map.
      }}
      requestCurrentUser={(params: {
        onResult: (params: { user: CallUser; error?: any }) => void;
      }) => {
        // TODO: get current user information.
      }}
    />
  );
}
```

**Note** The chat sdk and related technologies need to be used in actual development.
**Note** The actual development needs to pay attention to the hierarchical relationship of the page, and correctly load and unload the audio and video pages. [Reference](./src/App.tsx)

### Listener settings

You can receive invitation notifications and exception notifications by adding listeners.

```typescript
import * as React from 'react';
import { View } from 'react-native';
import {
  CallError,
  CallListener,
  CallType,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';

export default function HomeScreen(): JSX.Element {
  const { call } = useCallkitSdkContext();

  const addListener = React.useCallback(() => {
    const listener = {
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        // TODO: show call view.
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        // TODO: handle error.
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);

  return <View />;
}
```

### Main page introduction

Single person audio and video page `SingleCall` and multiplayer audio and video page `MultiCall`.

Basic general properties. The important required attributes mainly include:

- appKey: app chat id
- agoraAppId: App rtc id
- inviterId: inviter id
- currentId: current user id
- callType: audio or video chat
- isInviter: whether the current user is an inviter
- onClose: Close the page request, requiring the user to close and destroy the page.

```typescript
export type BasicCallProps = {
  inviterId: string;
  inviterName: string;
  inviterAvatar?: string;
  currentId: string;
  currentName: string;
  currentAvatar?: string;
  timeout?: number;
  bottomButtonType?: BottomButtonType;
  muteVideo?: boolean;
  callType: 'audio' | 'video';
  isInviter: boolean;
  callState?: CallState;
  isMinimize?: boolean;
  isTest?: boolean;
  onHangUp?: () => void;
  onCancel?: () => void;
  onRefuse?: () => void;
  onClose: (elapsed: number, reason?: CallEndReason) => void;
  onError?: (error: CallError) => void;
  onInitialized?: () => void;
  onSelfJoined?: () => void;
};
```

Single property.

```typescript
export type SingleCallProps = BasicCallProps & {
  inviteeId: string;
  onPeerJoined?: () => void;
};
```

Multiple attributes.

```typescript
export type MultiCallProps = BasicCallProps & {
  inviteeIds: string[];
  inviteeList?: {
    InviteeList: (props: InviteeListProps) => JSX.Element;
    props?: InviteeListProps;
  };
};
```

### Invite a single audio and video

Actively initiate an invitation and display the single-person audio and video page.
In the sample code, the main thing is to display the page by sending events.

```typescript
// send show call command.
sendHomeEvent();
// show call view.
VoiceStateContextType.showState();
```

### Invite multiple people to audio and video

Actively initiate an invitation to display the multi-person audio and video page.
The difference between sending multiple people and single people is that there are multiple inviters. For sample code, please refer to the single-person section.

### Receive invitation notification

After receiving the invitation notification, the audio and video call page is displayed.

### sample code

[Send command reference](./src/screens/Home.tsx)
[page display reference](./src/events/VoiceStateEvent.tsx)
