# react-native-chat-callkit

AgoraChatCallKit is an open-source audio and video UI library developed based on Agora's real-time communications and signaling services. With this library, you can implement audio and video calling functionalities with enhanced synchronization between multiple devices. In scenarios where a user ID is logged in to multiple devices, once the user deals with an incoming call that is ringing on one device, all the other devices stop ringing simultaneously.

## Environment Requirements

- react-native: 0.63.0 or later
- nodejs: 16.18.0 or later

## download link

```
git clone git@github.com:AgoraIO-Usecase/AgoraChat-rn.git
```

## Initialization

In the terminal, change to the project root directory.

```
cd react-native-chat-library
yarn && yarn run generate-source-env
```

## Introduction

The Agora Chat CallKit SDK is designed on the basis of the Agora Chat SDK. The two SDKS work together to implement one-to-one audio and video calls and group calls.

The Agora Chat CallKit SDK mainly provides a call manager, a call listener, and call views to implement calls.

| function     | description                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| CallManager  | A manager that provides functions such as adding and removing listeners.                                                               |
| CallListener | Listener for receiving notifications such as invitations.                                                                              |
| SingleCall   | A one-to-one call page for audio and video call operations such as inviting a user, answering the call, and hanging up the call.       |
| MultiCall    | A group call page for audio and video call operations operations such as inviting a user, answering the call, and hanging up the call. |

### Manager

The `CallManager` manager is mainly for call management by providing the following APIs:

- addListener: adds a listener.
- removeListener: removes a listener.

### Listener

The `CallListener` listener receives call invitations by providing the following callbacks:

- onCallReceived: Occurs when a call invitation is received.
- onCallOccurError: Occurs when an error is reported.

### Call pages

`SingleCall` provides one-to-one audio and video page components. `MultiCall` provides group audio and video page components. These two components have common functions, so there is also the basic audio and video component `BasicCall`.

Common properties provided by the two components are as follows:

| Property            | Type    | Description                                                                       |
| :------------------ | :------ | :-------------------------------------------------------------------------------- |
| `inviterId`         | String  | The user ID of the inviter.                                                       |
| `inviterName `      | String  | The nickname of the inviter.                                                      |
| `inviterAvatar `    | String  | The avatar URL of the inviter.                                                    |
| `currentId `        | String  | The current user ID.                                                              |
| `currentName `      | String  | The nickname of the current user.                                                 |
| `currentAvatar `    | String  | The avatar URL of the current user.                                               |
| `timeout `          | Number  | The timeout time. If the timeout period expires, the call hangs up automatically. |
| `bottomButtonType ` | String  | Initial Button group style.                                                       |
| `muteVideo `        | Boolean | Whether to disable video.                                                         |
| `callType `         | String  | The call type, i.e., audio call or video call.                                    |
| `callState `        | String  | The call state.                                                                   |
| `isMinimize `       | Boolean | Whether the call page is the minimized state.                                     |
| `isTest `           | Boolean | Whether to enable the test mode. It is disabled by default.                       |

Common events provided by the two components are as follows:

| Event           | Description                                                                                                                                                                                                                                                                        |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onHangUp`      | Occurs when a user hangs up a call. When a user hangs up a call, the local user receives the `onHangUp` event and the `onClose` event.                                                                                                                                             |
| `onCancel`      | Occurs when the call is cancelled. Only the caller receives the event.                                                                                                                                                                                                             |
| `onRefuse`      | Occurs when the call is rejected by the callee when a call invitation is received. The callee(s) receive this event.                                                                                                                                                               |
| `onClose`       | Occurs when a user hangs up a call. In one-to-one call, both users in the call receive this event. In a group call, the user that hangs up the call receives the event. This events also shows the call duration. In this event, you can close the call page to release resources. |
| `onError`       | Occurs when a call error is reported.                                                                                                                                                                                                                                              |
| `onInitialized` | Occurs when the page initialization is complete.                                                                                                                                                                                                                                   |
| `onSelfJoined`  | Occurs when a user joins a call. The user that successfully joins the call receives the event.                                                                                                                                                                                     |

Besides the common properties and events, `SingleCall` provides the following property and event:

- `inviteeId`: The user ID of the invitee. The property value is of the string type.
- `inviteeName`: The user name of the invitee. The property value is of the string type.
- `inviteeAvatar`: The user avatar url of the invitee. The property value is of the string type.
- `onPeerJoined`: Occurs when the invitee joins the call. The caller receives this event.

Besides the common properties and events, `MultiCall` provides the following properties:

- `inviteeIds`: The list of user IDs of the invitees when a group call is started. The property value is of the array type.
- `inviteeList`: The list of user IDs of the invitees during an ongoing group call. The property value is of the array type.
- `invitees`: Information about the invitees. Include name and avatar.
- `groupAvatar`: The avatar of the multi call. Use group avatars when calls are minimized.

For group audio and video calls, the Agora Chat CallKit SDK supports up to 18 video channels and 128 audio channels.

## Example Demo

[Reference](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-rn/blob/dev/examples/callkit-example/README.md)

## Contributing

See the [contributing guide](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-rn/blob/dev/packages/react-native-chat-callkit/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
