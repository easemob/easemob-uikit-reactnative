import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-chat-callkit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
export const isTurboModuleEnabled = global.__turboModuleProxy != null;

try {
  console.log('isTurboModuleEnabled', isTurboModuleEnabled);
  console.log('NativeModules', NativeModules, Object.keys(NativeModules));
  console.log('NativeModules.ChatCallkit', NativeModules.ChatCallkit);
  console.log('ChatCallkitModule', require('./NativeChatCallkit').default);
} catch (e) {
  console.log('ChatCallkitModule', e);
}

const ChatCallkitModule = isTurboModuleEnabled
  ? require('./NativeChatCallkit').default
  : NativeModules.ChatCallkit;

export const ChatCallkitModuleRN = ChatCallkitModule
  ? ChatCallkitModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const eventEmitter = new NativeEventEmitter(ChatCallkitModuleRN);

export function multiply(a: number, b: number): number {
  return ChatCallkitModuleRN.multiply(a, b);
}
