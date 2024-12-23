[Return to Parent Document](./index.en.md)

# Quick Start

## Prerequisites

- React-Native 0.70 or above;
- NodeJs 18 or above;

## Implementation

Take the following steps to implement message sending:

1. Create a project:

   ```
   npx @react-native-community/cli init --version 0.74  TestRoomUikitDemo
   ```

   And initialization project:

   ```bash
   yarn or yarn install
   ```

2. Added permission.

   - For iOS, update the `ProjectName/Info.plist` file to add the following permissions:

     ```xml
     <dict>
       <!-- Start of append section -->
             <key>NSCameraUsageDescription</key>
             <string></string>
             <key>NSMicrophoneUsageDescription</key>
             <string></string>
             <key>NSPhotoLibraryUsageDescription</key>
             <string></string>
       <!-- End of additional section -->
     </dict>
     ```

   - For Android, update the `AndroidManifest.xml` file:

     ```xml
     <manifest xmlns:android="http://schemas.android.com/apk/res/android">
         <uses-permission android:name="android.permission.INTERNET"/>
         <uses-permission android:name="android.permission.CAMERA" />
         <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
         <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
         <uses-permission android:name="android.permission.RECORD_AUDIO" />
     </manifest>
     ```

3. Add dependencies.

   ```bash
   yarn add react-native-async-storage/async-storage \
     react-native-camera-roll/camera-roll \
     react-native-clipboard/clipboard \
     react-native-chat-room \
     react-native-chat-sdk \
     date-fns \
     pinyin-pro \
     pure-uuid \
     react \
     react-native \
     react-native-agora \
     react-native-chat-uikit \
     react-native-chat-sdk \
     react-native-audio-recorder-player \
     easemob/react-native-create-thumbnail \
     react-native-device-info \
     react-native-document-picker \
     react-native-fast-image \
     react-native-file-access \
     react-native-gesture-handler \
     react-native-get-random-values \
     react-native-image-picker \
     react-native-permissions \
     react-native-safe-area-context \
     react-native-screens \
     react-native-video \
     react-native-web \
     react-native-webview \
     twemoji
   ```

4. Implement code.

   The main code added includes logging in, logging out, and into chat room:

   ```typescript
   import * as React from "react";
   import {
     Platform,
     Pressable,
     SafeAreaView,
     StyleSheet,
     Text,
     View,
   } from "react-native";
   import { useSafeAreaInsets } from "react-native-safe-area-context";
   import {
     Chatroom,
     Container,
     TextInput,
     useRoomContext,
   } from "react-native-chat-room";

   const appKey = "<your app key>";
   const userNickname = "<your nick name>";
   const userAvatarURL = "<your avatar url>";
   const userName = "";
   conste userAvatar = "";
   const roomId = "<chat room ID>";
   const room = {
     roomId: roomId,
     owner: userId,
   };

   function SendMessage() {
     const [page, setPage] = React.useState(0);
     const [appkey, setAppkey] = React.useState(appKey);
     const [id, setId] = React.useState(userId);
     const [ps, setPs] = React.useState(userToken);
     const im = useRoomContext();
     const { top } = useSafeAreaInsets();

     if (page === 0) {
       return (
         // Log in page
         <SafeAreaView style={styles.common}>
           <TextInput
             placeholder="Please App Key."
             value={appkey}
             onChangeText={setAppkey}
           />
           <TextInput
             placeholder="Please Login ID."
             value={id}
             onChangeText={setId}
           />
           <TextInput
             placeholder="Please Login token or password."
             value={ps}
             onChangeText={setPs}
           />
           <Pressable
             style={styles.login}
             onPress={() => {
               // Use a custom avatar and nickname.
               im.login({
                 userId: id,
                 userToken: ps,
                 userNickname: userNickname
                 userAvatarURL: userAvatarURL,
                 result: (res) => {
                   console.log("login result", res);
                   if (res.isOk === true) {
                     setPage(1);
                   }
                 },
               });
             }}
           >
             <Text>{"Login"}</Text>
           </Pressable>
           <Pressable
             style={styles.login}
             onPress={() => {
               im.logout({
                 result: () => {},
               });
             }}
           >
             <Text>{"Logout"}</Text>
           </Pressable>
         </SafeAreaView>
       );
     } else if (page === 1) {
       // chat room page
       return (
         <SafeAreaView style={styles.common}>
           <Chatroom
             messageList={{
               props: {
                 visible: true,
                 reportProps: {
                   data: [],
                 },
               },
             }}
             input={{
               props: {
                 keyboardVerticalOffset: Platform.OS === "ios" ? top : 0,
                 after: [],
               },
             }}
             roomId={room.roomId}
             ownerId={room.owner}
             onError={(e) => {
               console.log("ChatroomScreen:onError:", e.toString());
             }}
           >
             <Pressable
               style={[styles.logout, styles.login]}
               onPress={() => {
                 setPage(0);
                 im.logout({
                   result: () => {},
                 });
               }}
             >
               <Text>{"log out"}</Text>
             </Pressable>
           </Chatroom>
         </SafeAreaView>
       );
     } else {
       return <View />;
     }
   }

   function App(): React.JSX.Element {
     // initialize the chat room
     return (
       <Container opt={{appKey}}>
         <SendMessage />
       </Container>
     );
   }

   const styles = StyleSheet.create({
     common: {
       flex: 1,
     },
     logout: {
       position: "absolute",
       top: 0,
       right: 0,
     },
     login: {
       height: 40,
       backgroundColor: "darkseagreen",
       borderColor: "floralwhite",
       borderWidth: 1,
     },
   });

   export default App;
   ```

5. Compile and run the project.

   - For iOS: Run `yarn run ios`.
   - For Android: Run `yarn run android`.

6. Send the first message.

   Click **Login** to enter the chat room page, enter the text, and click **Send**.
