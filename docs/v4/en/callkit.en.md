[Return to Parent Document](./index.en.md)

- [CallKit Introduction](#callkit-introduction)
  - [Features Overview](#features-overview)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Dependencies](#dependencies)
  - [Initialization](#initialization)
    - [GlobalContainer Properties](#globalcontainer-properties)
    - [Initialization Example](#initialization-example)
  - [Core Components](#core-components)
    - [SingleCall - One-on-One Calls](#singlecall---one-on-one-calls)
    - [MultiCall - Multi-Party Calls](#multicall---multi-party-calls)
  - [Signaling Management](#signaling-management)
  - [Event Listeners](#event-listeners)
  - [Utility Methods](#utility-methods)

# CallKit Introduction

## Features Overview

CallKit is an audio/video calling UIKit based on Agora RTC, supporting:

- One-on-one audio/video calls (1v1)
- Multi-party audio/video calls (up to 18 video streams or 128 audio streams)
- Complete call UI components
- Call signaling management
- Customizable call interface and invitee list

## Requirements

- React Native 0.71 or higher
- iOS: Xcode 15 or higher
- Android: Android Studio 2022 or higher

## Installation

```sh
npm install react-native-chat-callkit
# or
yarn add react-native-chat-callkit
```

### Dependencies

```sh
yarn add @react-native-community/blur \
  react-native-agora \
  react-native-chat-sdk \
  react-native-safe-area-context \
  react-native-screens
```

## Initialization

Initialize CallKit using the `GlobalContainer` component, which must wrap your app at the top level.

### GlobalContainer Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `option` | `CallOption` | Yes | Call configuration options |
| `requestRTCToken` | `Function` | Yes | Callback to get RTC token |
| `requestUserMap` | `Function` | Yes | Callback to get user ID mapping |
| `requestCurrentUser` | `Function` | Yes | Callback to get current user info |
| `requestUserInfo` | `Function` | No | Callback to get user info (optional) |
| `requestInviteContent` | `Function` | No | Callback for custom invite content |
| `enableLog` | `boolean` | No | Whether to enable logging |
| `type` | `'easemob' \| 'agora'` | No | RTC token type, defaults to `agora` |
| `logHandler` | `Function` | No | Log handler callback |

**CallOption Configuration:**

```typescript
interface CallOption {
  appKey: string;        // Easemob AppKey (required)
  agoraAppId: string;    // Agora AppId (required)
  callTimeout?: number;  // Call timeout in seconds, default 30
  ringFilePath?: string; // Local ringtone file path
}
```

### Initialization Example

```tsx
import { GlobalContainer } from 'react-native-chat-callkit';

function App() {
  return (
    <GlobalContainer
      option={{
        appKey: 'your-app-key',
        agoraAppId: 'your-agora-app-id',
        callTimeout: 30,
      }}
      requestRTCToken={({ channelId, userId, userChannelId, type, onResult }) => {
        // Get RTC token from server
        fetch('your-server/rtc-token', {
          method: 'POST',
          body: JSON.stringify({ channelId, userId, userChannelId }),
        })
          .then(res => res.json())
          .then(data => onResult({ data: data.token }))
          .catch(error => onResult({ error }));
      }}
      requestUserMap={({ channelId, userId, onResult }) => {
        // Get user mapping
        fetch('your-server/user-map', {
          method: 'POST',
          body: JSON.stringify({ channelId, userId }),
        })
          .then(res => res.json())
          .then(data => onResult({ data }))
          .catch(error => onResult({ error }));
      }}
      requestCurrentUser={({ onResult }) => {
        // Return current user info
        onResult({
          user: {
            userId: 'current-user-id',
            userName: 'Current User',
            userAvatarUrl: 'avatar-url',
          },
        });
      }}
      requestUserInfo={({ userId, onResult }) => {
        // Get specified user info (optional)
        onResult({
          user: {
            userId,
            userName: 'User Name',
            userAvatarUrl: 'avatar-url',
          },
        });
      }}
      enableLog={true}
    >
      {/* Your app components */}
    </GlobalContainer>
  );
}
```

## Core Components

### SingleCall - One-on-One Calls

UI component for 1v1 audio/video calls.

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `inviteeId` | `string` | Yes | Invitee's user ID |
| `inviteeName` | `string` | No | Invitee's display name |
| `inviteeAvatar` | `string` | No | Invitee's avatar URL |
| `callType` | `'audio' \| 'video'` | Yes | Call type |
| `callState` | `CallState` | No | Call state |
| `isInviter` | `boolean` | Yes | Whether current user is the inviter |
| `currentId` | `string` | Yes | Current user ID |
| `currentName` | `string` | No | Current user display name |
| `currentAvatar` | `string` | No | Current user avatar URL |
| `isMinimize` | `boolean` | No | Whether to display in minimized mode |
| `onHangUp` | `Function` | No | Hang up callback |
| `onCancel` | `Function` | No | Cancel callback |
| `onRefuse` | `Function` | No | Refuse callback |
| `onError` | `Function` | No | Error callback |
| `onPeerJoined` | `Function` | No | Callback when peer joins the call |

**Example:**

```tsx
import { SingleCall, CallState } from 'react-native-chat-callkit';

function MyCallScreen() {
  return (
    <SingleCall
      inviteeId="peer-user-id"
      inviteeName="John Doe"
      inviteeAvatar="https://example.com/avatar.jpg"
      callType="video"
      isInviter={true}
      currentId="my-user-id"
      currentName="Me"
      onHangUp={(elapsed) => {
        console.log('Call ended, duration:', elapsed);
      }}
      onError={(error) => {
        console.error('Call error:', error);
      }}
    />
  );
}
```

### MultiCall - Multi-Party Calls

UI component for multi-party audio/video calls.

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `inviteeIds` | `string[]` | Yes | List of invitee user IDs |
| `invitees` | `CallUser[]` | No | List of invitee information |
| `groupId` | `string` | No | Group ID |
| `groupName` | `string` | No | Group name |
| `groupAvatar` | `string` | No | Group avatar URL |
| `callType` | `'audio' \| 'video'` | Yes | Call type |
| `isInviter` | `boolean` | Yes | Whether current user is the inviter |
| `currentId` | `string` | Yes | Current user ID |
| `inviteeList` | `Object` | No | Custom invitee list component |

**Invitee List Component Properties:**

```typescript
interface InviteeListProps {
  selectedIds: string[];     // Selected user IDs
  maxCount: number;          // Max invite count (18 for video, 128 for audio)
  onClose: (addedIds: string[], addeds?: CallUser[]) => void;  // Close callback
  onCancel: () => void;      // Cancel callback
}
```

**Example:**

```tsx
import { MultiCall } from 'react-native-chat-callkit';

function MyMultiCallScreen() {
  return (
    <MultiCall
      inviteeIds={['user1', 'user2', 'user3']}
      invitees={[
        { userId: 'user1', userName: 'User 1', userAvatarUrl: 'url1' },
        { userId: 'user2', userName: 'User 2', userAvatarUrl: 'url2' },
        { userId: 'user3', userName: 'User 3', userAvatarUrl: 'url3' },
      ]}
      callType="video"
      isInviter={true}
      currentId="my-user-id"
      groupId="group-id"
      groupName="Group Name"
      onHangUp={(elapsed) => {
        console.log('Call ended');
      }}
    />
  );
}
```

## Signaling Management

CallKit provides `CallManager` for managing call signaling, which is implemented based on Easemob IM.

**Get Manager:**

```typescript
import { createManager } from 'react-native-chat-callkit';

const callManager = createManager();
```

**Main Methods:**

- `addListener(listener: CallListener)`: Add call event listener
- `removeListener(listener: CallListener)`: Remove event listener
- `setLogHandler(handler)`: Set log handler

## Event Listeners

Listen to call events through the `CallListener` interface:

```typescript
import { CallListener, CallType } from 'react-native-chat-callkit';

const listener: CallListener = {
  // Receive call invitation
  onCallReceived: ({ channelId, inviterId, callType, extension }) => {
    console.log('Call received from:', inviterId);
    // Show call interface
  },
  
  // Call error
  onCallOccurError: ({ channelId, error }) => {
    console.error('Call error:', error);
  },
  
  // Signaling message
  onSignallingMessage: (msg) => {
    console.log('Signaling message:', msg);
  },
};

callManager.addListener(listener);
```

## Utility Methods

**Enum Types:**

```typescript
// Call Type
enum CallType {
  Audio1v1 = 0,      // One-on-one audio
  Video1v1 = 1,      // One-on-one video
  VideoMulti = 2,    // Multi-party video
  AudioMulti = 3,    // Multi-party audio
}

// Call State
enum CallState {
  Idle = 0,          // Idle
  Connecting = 1,    // Connecting
  Calling = 2,       // In call
}

// End Reason
enum CallEndReason {
  HungUp = 0,            // Hung up
  Cancel = 1,            // Cancelled
  RemoteCancel = 2,      // Remote cancelled
  RemoteRefuse = 3,      // Remote refused
  RemoteBusy = 4,        // Remote busy
  NoResponse = 5,        // No response
  RemoteNoResponse = 6,  // Remote no response
  HandleOnOtherDevice = 7, // Handled on other device
}
```

**Utility Functions:**

```typescript
import { formatElapsed, timestamp, CALLKIT_VERSION } from 'react-native-chat-callkit';

// Format call duration (seconds -> HH:MM:SS)
const timeStr = formatElapsed(3661); // "01:01:01"

// Get current timestamp
const now = timestamp();

// Get CallKit version
console.log(CALLKIT_VERSION);
```
