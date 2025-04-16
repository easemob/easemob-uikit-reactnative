import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-chat-room' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
export const isTurboModuleEnabled = global.__turboModuleProxy != null;

try {
  console.log('isTurboModuleEnabled', isTurboModuleEnabled);
  console.log('NativeModules', NativeModules, Object.keys(NativeModules));
  console.log('NativeModules.ChatRoom', NativeModules.ChatRoom);
  console.log('ChatRoomModule', require('./NativeChatRoom').default);
} catch (e) {
  console.log('ChatRoomModule', e);
}

const ChatRoomModule = isTurboModuleEnabled
  ? require('./NativeChatRoom').default
  : NativeModules.ChatRoom;

export const ChatRoomModuleRN = ChatRoomModule
  ? ChatRoomModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const eventEmitter = new NativeEventEmitter(ChatRoomModuleRN);

export function multiply(a: number, b: number): number {
  return ChatRoomModuleRN.multiply(a, b);
}
