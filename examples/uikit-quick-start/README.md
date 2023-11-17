# Get started with Agora Chat UIKit

Instant messaging connects people wherever they are and allows them to communicate with others in real time. With built-in user interfaces (UI) for the message list, the [Agora Chat UI Samples](https://docs.agora.io/en/agora-chat/get-started/get-started-uikit?platform=react-native) enables you to quickly embed real-time messaging into your app without requiring extra effort on the UI.

This page shows a sample code to add peer-to-peer messaging into your app by using the Agora Chat UI Samples.

## Understand the tech

The following figure shows the workflow of how clients send and receive peer-to-peer messages:

<div align=center> <img src="https://docs.agora.io/en/assets/images/get-started-sdk-understand-009486abec0cc276183ab535456cf889.png" width = "300" /></div>

1. Clients retrieve a token from your app server.
2. Client A and Client B log in to Agora Chat.
3. Client A sends a message to Client B. The message is sent to the Agora Chat server and the server delivers the message to Client B. When Client B receives the message, the SDK triggers an event. Client B listens for the event and gets the message.

## Prerequisites

- react-native: 0.66.0 or later
- nodejs: 16.18.0 or later

## Token generation

This section describes how to register a user at Agora Console and generate a temporary token.

### Register a user

To generate a user ID, do the following:

1. On the **Project Management** page, click **Config** for the project you want to use.

![](https://web-cdn.agora.io/docs-files/1664531061644)

2. On the **Edit Project** page, click **Config** next to **Chat** below **Features**.

![](https://web-cdn.agora.io/docs-files/1664531091562)

3. In the left-navigation pane, select **Operation Management** > **User** and click **Create User**.

![](https://web-cdn.agora.io/docs-files/1664531141100)

4. In the **Create User** dialog box, fill in the **User ID**, **Nickname**, and **Password**, and click **Save** to create a user.

![](https://web-cdn.agora.io/docs-files/1664531162872)

### Generate a user token

To ensure communication security, Agora recommends using tokens to authenticate users logging in to an Agora Chat system.

For testing purposes, Agora Console supports generating Agora chat tokens. To generate an Agora chat token, do the following:

1. On the **Project Management** page, click **Config** for the project you want to use.

![](https://web-cdn.agora.io/docs-files/1664531061644)

2. On the **Edit Project** page, click **Config** next to **Chat** below **Features**.

![](https://web-cdn.agora.io/docs-files/1664531091562)

3. In the **Data Center** section of the **Application Information** page, enter the user ID in the **Chat User Temp Token** box and click **Generate** to generate a token with user privileges.

![](https://web-cdn.agora.io/docs-files/1664531214169)

## Project Initialization And Run

Run the `yarn` command to initialize the React-Native project:

```sh
cd examples/uikit-quick-start
yarn && yarn run env
```

In the `env.ts` file, configure your information.

- appKey: your chat app key
- id: your ID
- token: your ID token

```sh
cd ios && pod install
yarn run ios
# or
yarn run android
```

## Reference

[How to create a new project and use UIKit](./docs/create_new_app.md)
